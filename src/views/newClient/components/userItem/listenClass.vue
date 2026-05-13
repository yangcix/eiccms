<!-- recordlist -->
<template>
    <div v-if="type == 1" class="box">
        <div class="header">
            <div class="left">
                <div v-if="permission.initiate" :class="actives == 1 ? 'active item' : 'item'" @click="changeTab(1)">
                    我的评课
                </div>
                <div
                    v-if="permission.participate"
                    :class="actives == 3 ? 'active item' : 'item'"
                    style="margin-left: 10px"
                    @click="changeTab(3)"
                >
                    我参与的
                </div>
            </div>
            <div class="right">
                <el-button v-if="permission.save" icon="el-icon-plus" size="small" type="primary" @click="addLive"
                    >新增活动</el-button
                >
            </div>
        </div>
        <el-divider></el-divider>
        <div class="content" v-if="list.length && list.length > 0">
            <div class="item" v-for="(val, index) in list" :key="index">
                <div class="left">
                    <div class="img-wrap" @click="goDetail(val)">
                        <img :src="val.coverUrl ? val.coverUrl : defaultImg" alt="" :onerror="defaultImg" />
                        <p class="video-status status1" v-if="val.status == 4">
                            <span class="playAnimation">
                                <span class="animationli"></span>
                                <span class="animationli"></span>
                                <span class="animationli"></span>
                                <span class="animationli"></span> </span
                            >正在评课
                        </p>
                        <p class="video-status status0" v-if="val.status == 3">
                            <i class="el-icon-alarm-clock"></i>即将开始
                        </p>
                        <p class="video-status status2" v-if="val.status == 5">
                            <i class="el-icon-refresh-left"></i>已经结束
                        </p>
                        <p class="video-status status2" v-if="val.status == 6">
                            <i class="el-icon-refresh-left"></i>驳回<i
                                :title="val.reason ? val.reason : '无理由'"
                                class="el-icon-question"
                                style="margin-left: 5px"
                            ></i>
                        </p>
                        <p class="video-status status2" v-if="val.status == 1">
                            <i class="el-icon-refresh-left"></i>待提交
                        </p>
                        <p class="video-status status2" v-if="val.status == 2">
                            <i class="el-icon-refresh-left"></i>待审核
                        </p>
                    </div>
                    <div class="right">
                        <div style="display: flex">
                            <div class="title" :title="val.name">
                                {{ val.name }}
                            </div>
                            <span class="resources">{{
                                val.resources == 1
                                    ? '站内资源'
                                    : val.resources == 2
                                    ? '排课录制'
                                    : val.resources == 3
                                    ? '本地上传'
                                    : val.resources == 4
                                    ? '智课终端'
                                    : '历史录制资源'
                            }}</span>
                        </div>

                        <div class="main">
                            <div>
                                <span
                                    :title="val.teacherName"
                                    style="
                                        width: 160px;
                                        font-size: 14px;
                                        text-overflow: ellipsis;
                                        line-clamp: 1;
                                        overflow: hidden;
                                        white-space: nowrap;
                                    "
                                    >授课教师：{{ val.teacherName }}</span
                                >
                                <span
                                    style="
                                        width: 200px;
                                        font-size: 14px;
                                        text-overflow: ellipsis;
                                        line-clamp: 1;
                                        overflow: hidden;
                                    "
                                    >学科：{{ val.subjectName }}</span
                                >
                            </div>
                            <div>
                                <span
                                    :title="val.evaluationOrgName"
                                    style="
                                        width: 160px;
                                        font-size: 14px;
                                        text-overflow: ellipsis;
                                        line-clamp: 1;
                                        overflow: hidden;
                                        white-space: nowrap;
                                    "
                                    >所属学校：{{ val.evaluationOrgName }}</span
                                >
                                <span
                                    style="
                                        width: 200px;
                                        font-size: 14px;
                                        text-overflow: ellipsis;
                                        line-clamp: 1;
                                        overflow: hidden;
                                    "
                                    >开始时间：{{ val.startTime }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnbox">
                    <el-button
                        size="mini"
                        v-if="val.status == 3 || val.status == 4"
                        type="primary"
                        style="width: 80px; margin-left: 0px"
                        @click="openQrcodeShow(val)"
                        >分享</el-button
                    >
                    <el-button
                        size="mini"
                        v-if="val.status == 4 && actives == 3"
                        type="primary"
                        style="width: 80px; margin-left: 0px; margin-top: 5px"
                        @click="goDetail(val)"
                        >评价</el-button
                    >
                    <el-button
                        v-if="val.status == 5 && actives == 3"
                        type="primary"
                        size="mini"
                        @click="goDetail(val)"
                        style="margin-top: 5px; margin-left: 0px"
                        >查看详情</el-button
                    >
                    <!-- <el-button
            v-if="
              (val.status == 5 || val.status == 4 || val.status == 3) &&
              userType !== 0 &&
              actives == 1
            "
            :type="val.status == 5 || val.status == 4 ? 'primary' : ''"
            :class="val.status == 3 ? 'garyBtn' : ''"
            size="mini"
            @click="openReport(val)"
            style="margin-top: 5px; margin-left: 0px"
            >查看报告</el-button
          > -->
                    <el-button
                        v-if="(val.status == 5 || val.status == 4) && actives == 1"
                        :type="val.status == 5 || val.status == 4 ? 'primary' : ''"
                        size="mini"
                        @click="openReport(val)"
                        style="margin-top: 5px; margin-left: 0px"
                        >查看报告</el-button
                    >
                    <el-button
                        v-if="val.status == 1 || val.status == 6"
                        style="width: 80px"
                        size="mini"
                        @click="editData(val)"
                        >编辑</el-button
                    >
                    <el-button
                        v-if="val.status == 1"
                        style="width: 80px; margin-top: 5px; margin-left: 0px"
                        type="primary"
                        size="mini"
                        @click="submit(0, val)"
                        >送审</el-button
                    >
                    <el-button
                        v-if="val.status == 1 || val.status == 6"
                        style="width: 80px; margin-top: 5px; margin-left: 0px"
                        size="mini"
                        @click="deleteData(0, val)"
                        >删除</el-button
                    >
                </div>
            </div>
            <div class="pagination-wrap">
                <el-pagination
                    background
                    :page-size="5"
                    layout="prev, pager, next"
                    :current-page="pageNum"
                    @current-change="pageChange"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <div class="null-data" v-else>
            <img :src="nullimg" alt="" />
            <p>{{ !permission.initiate && !permission.participate ? '暂无访问权限！' : '暂无内容！' }}</p>
        </div>
        <el-dialog
            title="系统提示"
            style="margin-top: 16vh"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="submitShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-delete">确认送审？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="submit(1)">确 定</el-button>
                    <el-button @click="submitShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="删除评课"
            :append-to-body="true"
            :visible.sync="deleteShow"
            style="margin-top: 16vh"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-delete">确认删除该评课？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData(1)">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="听评课活动海报"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="qrcodeShow"
            width="420px"
        >
            <div class="dialog-wrap">
                <div class="qrcode-wrap" ref="downloadShare">
                    <img :src="detailInfo.coverUrl ? detailInfo.coverUrl : defaultImg" alt="" :onerror="defaultImg" />
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
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="reportShow"
            width="420px"
        >
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
                        <el-button v-if="detailData.aiStatus != 3" type="text" @click="viewReport(1, item)"
                            >查看复盘/报告</el-button
                        >
                        <el-button
                            v-if="detailData.isResetting == 0 && detailData.aiConfigId == 2 && detailData.aiStatus == 3"
                            type="text"
                            @click="resetting()"
                            >重置分析</el-button
                        >
                        <el-button
                            style="color: #b3b6ba"
                            v-if="detailData.isResetting == 1 && detailData.aiConfigId == 2 && detailData.aiStatus == 3"
                            type="text"
                            disabled
                            >重置分析</el-button
                        >
                        <!-- <div v-if="detailData.aiConfigId == 2 && detailData.aiStatus == 3">
              <el-button v-if="detailData.isResetting == 0" type="text" @click="resetting()">重置分析</el-button>
              <el-button style="color: #b3b6ba;" v-else type="text" disabled>重置分析</el-button>
            </div> -->
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="evaluationTems"
            width="70%"
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
                            <!--              <div v-if="scope.row.type == 0">
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
              </span>-->
                            {{ scope.row.contentSummarize }}
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
            class="add-dialog"
            title="选择评课类型"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="addShow"
            width="680px"
        >
            <div class="add-box">
                <div class="add-item" @click="goEdit(1)">
                    <span style="font-size: 18px; font-weight: 600; color: #333333; margin-top: 70px">人工评价</span>
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
    <div v-else class="box" style="height: 614px">
        <div class="">
            <i class="el-icon-arrow-left" style="cursor: pointer" @click="addLive(1)"></i>
            {{ addEditInfo.id ? '编辑' : '发起' }}听评课活动
        </div>
        <el-divider></el-divider>
        <div class="addBox">
            <p style="font-weight: 600; margin-top: 5px; font-size: 14px; color: #435cf9; margin-bottom: 25px">
                基础信息
            </p>
            <div
                class="item-wrap"
                v-if="aiType == 2 && radio1 == 2 && feeModel == 1 && (!isEdit || (isEdit && isTranslationPending))"
            >
                <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                <p>{{ aiNum }}次</p>
            </div>
            <div
                class="item-wrap"
                v-if="aiType == 2 && radio1 == 2 && feeModel == 1 && (!isEdit || (isEdit && isTranslationPending))"
            >
                <p>优先使用<em>*</em>：</p>
                <el-select
                    :popper-append-to-body="false"
                    v-model="addEditInfo.aiProjectId"
                    class="width-3"
                    size="small"
                >
                    <el-option
                        v-for="item in useList"
                        :key="item.allocationId"
                        :label="item.projectName + '-' + item.residueNum + '次'"
                        :value="item.allocationId"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="item-wrap">
                <div style="display: flex">
                    <p>评课名称<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-input class="width-2" size="small" v-model="addEditInfo.name" clearable></el-input>
                </div>
            </div>
            <div class="item-wrap" v-if="aiStatus == 1 && radio1 == 2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <p>课堂类型<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-radio-group v-model="addEditInfo.classTypeId">
                        <el-radio v-for="(item, index) in classTypeList" :label="item.id" :key="index">{{
                            item.name
                        }}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="item-wrap" style="align-items: start">
                <div style="display: flex">
                    <p style="width: 94px">评课分类<em style="margin-left: 5px; line-height: 14px">*</em></p>
                </div>
                <div>
                    <div class="itemType" style="padding-left: 0; margin-left: 10px">
                        <el-select
                            style="width: 136px"
                            size="small"
                            :popper-append-to-body="false"
                            @change="handleTheme"
                            v-model="themeValue"
                            placeholder="请选择"
                        >
                            <el-option v-for="item in themeData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="itemType" style="margin-left: 10px" v-for="(nape, index) in themeTypeList" :key="index">
                        <el-tooltip class="item" effect="dark" :content="`请选择${nape.name}`" placement="top-start">
                            <el-select
                                style="width: 136px"
                                size="small"
                                :popper-append-to-body="false"
                                clearable
                                v-model="nape.value"
                                :placeholder="`请选择${nape.name}`"
                                v-if="nape.aiCategorySonDtos"
                            >
                                <el-option
                                    v-for="item in nape.aiCategorySonDtos"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="item-wrap">
                <p>评课开始时间<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-date-picker
                    size="small"
                    v-model="addEditInfo.startTime"
                    type="datetime"
                    class="width-2"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间"
                >
                </el-date-picker>
                <!-- <p class="err-notice">注：开始时间需大于当前时间</p> -->
            </div>

            <div class="item-wrap">
                <p>评课结束时间<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-date-picker
                    size="small"
                    v-model="addEditInfo.endTime"
                    type="datetime"
                    class="width-2"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间"
                >
                </el-date-picker>
                <!-- <p class="err-notice">注：大于开始时间</p> -->
            </div>
            <div class="item-wrap">
                <div style="display: flex">
                    <p>授课教师<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-input class="width-2" size="small" v-model="userName" disabled></el-input>
                </div>
            </div>
            <!-- <div class="item-wrap">
        <p>所属学校<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.groupId" placeholder="选择所属学校"
          class="width-2" style="margin-right: 2px" filterable>
          <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>
      </div> -->
            <div class="item-wrap">
                <p>评课班级<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    size="small"
                    v-model="addEditInfo.orgId"
                    @change="shcoolChange"
                    placeholder="选择学校"
                    style="margin-right: 10px; width: 130px"
                    filterable
                >
                    <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select
                    size="small"
                    @change="changeGrade()"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.evaluationGrade"
                    placeholder="选择年级"
                    style="margin-right: 10px; width: 130px"
                    filterable
                >
                    <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.name" :value="item.gradeId">
                    </el-option>
                </el-select>
                <el-select
                    size="small"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.evaluationClass"
                    @change="changeClass()"
                    placeholder="选择班级"
                    style="margin-right: 10px; width: 130px"
                    filterable
                >
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item-wrap">
                <p>评课教师组<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    size="small"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.groupId"
                    placeholder="选择用户组"
                    class="width-2"
                    style="margin-right: 2px"
                    filterable
                >
                    <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item-wrap">
                <p>评课模板<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    :popper-append-to-body="false"
                    v-model="addEditInfo.templateList"
                    placeholder="请选择评课模板"
                    class="width-2"
                    size="small"
                    style="margin-right: 2px"
                    filterable
                    multiple
                >
                    <el-option
                        v-for="item in evaluationTemplateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="item-wrap">
        <p>评课类型<em style="margin-left: 5px;line-height: 14px;">*</em></p>
        <el-radio-group v-model="radio1" @change="changeType()">
          <el-radio :label="1">人工评价</el-radio>
          <el-radio v-if="aiStatus == 1" :label="2">人工评价+AI评价</el-radio>
        </el-radio-group>
       
        <p v-if="aiStatus == 1" class="err-notice">注：开启AI课堂分析时，则必须上传教案文件</p> 
      </div> -->
            <div v-if="radio1 == 2" class="item-wrap edufile">
                <p>教案<em>*</em>：</p>
                <el-upload
                    ref="edufileupload"
                    :action="eduFileUrl"
                    class="upload-edufile"
                    accept=".docx"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :before-upload="eduBeforeupload"
                    multiple
                    :with-credentials="true"
                    :limit="5"
                    :on-exceed="handleExceed"
                    :on-error="handleEduError"
                    :on-success="handleEduSuccess"
                    :file-list="edufileList"
                >
                    <el-button size="mini" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload-tip">只能上传后缀为docx教学相关文件，大小需小于50M</div>
                </el-upload>
            </div>
            <div class="item-wrap upload-box">
                <p>封面</p>
                <p class="p1"></p>
                <div class="upload-wrap">
                    <el-upload
                        class="upload-demo"
                        :limit="1"
                        :action="uploadUrl"
                        :on-exceed="handleOnExceed"
                        accept=".png,.jpg"
                        :file-list="fileList"
                        :on-change="selectFile"
                        :on-remove="removeFile"
                        list-type="picture"
                        :auto-upload="false"
                        drag
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409eff">点击上传</em></div>
                        <div class="el-upload-tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </div>
            </div>
            <p style="font-weight: 600; margin-top: 5px; font-size: 14px; color: #435cf9; margin-bottom: 25px">
                视频资源
            </p>
            <div class="item-wrap" v-show="!addEditInfo.id">
                <p>资源来源<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-radio-group v-model="radio2" @change="getGradeLists()" :class="aiType == 2 ? 'aiType_style' : ''">
                    <el-radio :label="2">排课录制</el-radio>
                    <el-radio v-if="radio1 == 2" :label="3">本地上传</el-radio>
                    <el-radio :label="1">站内资源</el-radio>
                    <el-radio v-if="radio1 == 2" :label="4">智课终端</el-radio>
                    <el-radio v-if="radio1 == 2" :label="5">历史录制资源</el-radio>
                    <el-tooltip :content="tooltipContent" placement="right" effect="dark">
                        <i
                            v-if="radio1 == 2 && radio1 == 2"
                            class="iconfont icon-wenhao"
                            style="margin-left: -10px; color: rgb(121, 145, 255)"
                        ></i>
                    </el-tooltip>
                </el-radio-group>
            </div>
            <p v-show="radio1 == 2 && !addEditInfo.id" v-if="radio2 == 2 && !addEditInfo.id" class="notes">
                注：将自动录制开始时间到结束时间区间范围的视频进行AI分析，请合理安排好时间！
            </p>
            <p
                v-show="radio1 == 2 && !addEditInfo.id"
                v-if="radio2 == 4 && !addEditInfo.id"
                class="notes"
                style="width: 541px"
            >
                注：将<span style="color: red">手动</span
                >录制开始时间到结束时间区间范围的视频进行AI分析，需小于60分钟，请合理安排好时间！
            </p>
            <div class="item-wrap" v-if="radio2 == 4">
                <p>录制方式<em>*</em>：</p>
                <el-radio-group
                    v-model="addEditInfo.recordingMethod"
                    style="display: flex; justify-content: center; align-items: center"
                >
                    <el-radio v-for="(item, index) in recordingMethodList" :label="item.id" :key="index">{{
                        item.name
                    }}</el-radio>
                </el-radio-group>
            </div>
            <div v-if="radio2 == 1" class="item-wrap">
                <p>课堂视频<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-tag
                    class="elTag"
                    v-if="objectName"
                    closable
                    :title="objectName"
                    :disable-transitions="false"
                    @close="handleCloseTag()"
                >
                    {{ objectName }}
                </el-tag>
                <el-button
                    style="margin-left: 10px"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="bindTheme"
                    >{{ addEditInfo.objectId ? '更改资源' : '选择资源' }}</el-button
                >
                <p
                    v-if="aiType == 2 && radio2 == 5"
                    :style="{
                        fontSize: '14px',
                        color: 'red',
                        marginLeft: '105px',
                        marginTop: '20px',
                        marginBottom: '-10px',
                    }"
                >
                    注：仅可选择时长不可超过60分钟的视频资源
                </p>
            </div>
            <div v-else-if="radio2 == 2 || radio2 == 4">
                <div class="item-wrap">
                    <p>课堂开始时间<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-date-picker
                        size="small"
                        v-model="addEditInfo.liveStartTime"
                        @change="clearTerminal"
                        type="datetime"
                        class="width-3"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始时间"
                    >
                    </el-date-picker>
                    <p v-if="radio2 == 2" class="err-notice"><em>*</em>需大于当前时间</p>
                    <p v-if="radio2 == 4" class="err-notice">
                        <em>*</em>需大于当前时间，该时间为预设时间，具体开始时间以实际开始录制时间为准
                    </p>
                </div>

                <div class="item-wrap">
                    <p>课堂时长<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-input
                        class="width-3"
                        v-model="addEditInfo.durationMinutes"
                        clearable
                        placeholder="请输入课堂时长"
                        size="small"
                        @change="changeDurationMin"
                    ></el-input>
                    &nbsp;分钟
                    <p class="err-notice"><em>*</em>课堂时长最多60分钟</p>
                </div>
                <div v-if="radio2 == 2 || radio2 == 4" class="item-wrap">
                    <p>上课位置<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-select
                        size="small"
                        v-model="addEditInfo.buildingId"
                        @change="buildChange"
                        placeholder="请选择教学楼"
                        style="margin-right: 10px; width: 130px"
                        filterable
                    >
                        <el-option v-for="item in buildlList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select
                        size="small"
                        v-model="addEditInfo.classroomId"
                        @change="classroomChange(1)"
                        placeholder="请选择教室"
                        style="width: 120px"
                        filterable
                    >
                        <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div v-show="radio2 == 2" class="item-wrap">
                    <p>直播设备<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-select
                        size="small"
                        v-model="addEditInfo.terminalIdList"
                        placeholder="请选择设备"
                        class="width-2"
                        filterable
                        style="width: 300px"
                    >
                        <el-option
                            v-for="item in terminalIdList"
                            :key="item.id"
                            :label="item.terminalName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                    <p class="err-notice">注：提前添加设备并绑定至直播教室</p>
                </div>
                <div v-if="radio2 == 4" class="item-wrap">
                    <p><em></em></p>
                    <span v-if="terminalName !== ''" style="color: #999; font-size: 14px">{{ terminalName }}</span>
                    <span v-else style="color: #999; font-size: 14px">无设备</span>
                </div>
            </div>
            <div v-else-if="radio2 == 3">
                <div class="item-wrap item-wrap upload-box videoList">
                    <p>{{ aiType == 1 ? '教师画面视频' : '视频' }}<em>*</em>：</p>
                    <div class="upload-wrap teacher">
                        <el-upload
                            :limit="1"
                            :on-exceed="handleOnExceeds"
                            class="upload-demo"
                            :action="uploadUrl"
                            :accept="'.mp4,.MP4'"
                            :file-list="teacherVideo"
                            :on-change="selectVideot"
                            :on-remove="removet"
                            list-type="picture"
                            :auto-upload="false"
                            :drag="true"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                            </div>
                            <div class="el-upload-tip" slot="tip">
                                <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过1.8G;
                            </div>
                        </el-upload>
                        <div id="vp" ref="vp"></div>
                    </div>
                    <p v-if="aiType == 1" style="line-height: 40px; color: #303133; font-size: 14px; margin-left: 10px">
                        学生画面视频<em>*</em>：
                    </p>
                    <div v-if="aiType == 1" class="upload-wrap student">
                        <el-upload
                            :limit="1"
                            :on-exceed="handleOnExceeds"
                            class="upload-demo"
                            :action="uploadUrl"
                            :accept="'.mp4,.MP4'"
                            :file-list="studentVideo"
                            :on-change="selectVideos"
                            :on-remove="removes"
                            list-type="picture"
                            :auto-upload="false"
                            :drag="true"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                            </div>
                            <div class="el-upload-tip" slot="tip">
                                <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过3G;
                            </div>
                        </el-upload>
                    </div>
                </div>
                <p style="font-size: 14px; color: red; margin-top: 10px; margin-left: 108px">
                    注：上传的视频资源要与页面填写信息一致，不然将会影响AI分析结果的准确性
                </p>
            </div>
            <div v-else class="item-wrap">
                <p>课堂视频<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-tag
                    class="elTag"
                    v-if="objectVideoName"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseVideoTag()"
                    >{{ objectVideoName }}</el-tag
                >
                <el-button
                    size="mini"
                    style="margin-left: 10px"
                    type="primary"
                    icon="el-icon-plus"
                    @click="handleAdd()"
                    >{{ addEditInfo.videoId ? '更改资源' : '选择资源' }}</el-button
                >
            </div>
            <p
                v-if="aiType == 2 && radio2 == 5"
                :style="{fontSize: '14px', color: 'red', marginLeft: '115px', marginTop: '10px'}"
            >
                注：仅可选择时长不可超过60分钟的视频资源
            </p>
            <div style="text-align: center; margin: 10px 0 20px 0">
                <el-button
                    size="mini"
                    :loading="loadingBtn"
                    class="edit-btn"
                    @click="save"
                    v-if="permission.save && (!isEdit || (isEdit && isTranslationPending))"
                    >暂存</el-button
                >
                <el-button size="mini" :loading="loadingBtnOne" type="primary" class="edit-btn" @click="save('1')"
                    >保存并送审</el-button
                >
                <el-button size="mini" type="primary" class="edit-btn" @click="save(2)">一键发布</el-button>
            </div>
            <el-dialog
                title="系统错误"
                :append-to-body="true"
                :close-on-click-modal="false"
                :visible.sync="upErrorShow"
                width="420px"
            >
                <div class="dialog-wrap">
                    <p class="err-delete">{{ upErrorMsg }}</p>
                </div>
            </el-dialog>
            <el-dialog
                title="绑定主题"
                :append-to-body="true"
                :close-on-click-modal="false"
                :visible.sync="chooseCpm"
                width="45%"
                :before-close="handleClose"
            >
                <div>
                    <el-tabs v-model="activeName" @tab-click="handleTab">
                        <el-tab-pane label="选择直播" name="first">
                            <div>
                                <el-input
                                    class="width-2"
                                    v-model="liveKey"
                                    clearable
                                    placeholder="请输入直播主题名称关键字"
                                    v-search="searchLive"
                                ></el-input>
                                <el-button type="primary" class="search-btn" @click="searchLive">查询</el-button>
                            </div>
                            <div>
                                <el-table v-loading="loadingW" :data="liveList" style="width: 100%">
                                    <el-table-column align="left" label="主题名称" width="180">
                                        <template slot-scope="scope">
                                            <el-tooltip
                                                :disabled="scope.row.name.length > 10 ? false : true"
                                                class="item"
                                                effect="dark"
                                                :content="scope.row.name"
                                                placement="top-start"
                                            >
                                                <div class="nameHide">{{ scope.row.name }}</div>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="createUserName" label="作者" width="180">
                                    </el-table-column>
                                    <el-table-column align="center" label="操作">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-link
                                                    :disabled="addEditInfo.objectId === scope.row.id"
                                                    :underline="false"
                                                    type="primary"
                                                    @click="handleAddDataList(scope.row, 0)"
                                                    >添加</el-link
                                                >
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="table-page">
                                <el-pagination
                                    :page-size="8"
                                    layout="prev, pager, next"
                                    @current-change="pageChangeL"
                                    :current-page="pageNumL"
                                    :page-count="pagesL"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-if="radio1 == 1" label="选择视频" name="second">
                            <div>
                                <el-input
                                    class="width-2"
                                    v-model="videoSeekT"
                                    clearable
                                    placeholder="请输入视频名称关键字"
                                    v-search="handleSearchT"
                                ></el-input>
                                <el-button type="primary" class="search-btn" @click="handleSearchT">查询</el-button>
                            </div>
                            <div>
                                <el-table v-loading="loadingW" :data="videoList" style="width: 100%">
                                    <el-table-column align="left" prop="name" label="视频名称" width="180">
                                    </el-table-column>
                                    <el-table-column align="center" prop="createUserName" label="作者" width="180">
                                    </el-table-column>
                                    <el-table-column align="center" label="操作">
                                        <template slot-scope="scope">
                                            <div>
                                                <!-- {{ scope.row | filtersDisabled }} -->
                                                <el-link
                                                    :disabled="addEditInfo.videoId === scope.row.id"
                                                    :underline="false"
                                                    type="primary"
                                                    @click="handleAddDataList(scope.row, 1)"
                                                    >添加</el-link
                                                >
                                                <!-- <el-link :disabled="scope.row | filtersDisabled" :underline="false" type="primary" @click="handleAddDataList(scope.row)">添加</el-link> -->
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="table-page">
                                <el-pagination
                                    :page-size="8"
                                    layout="prev, pager, next"
                                    @current-change="pageChangeT"
                                    :current-page="pageNumT"
                                    :page-count="pagesT"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-dialog>
            <el-dialog
                title="选择资源"
                :append-to-body="true"
                :close-on-click-modal="false"
                :visible.sync="videoShow"
                :before-close="closeVideoShow"
            >
                <div class="video-wrap">
                    <el-tabs v-model="videoActiveName">
                        <el-tab-pane label="选择录制视频" name="first">
                            <div>
                                <el-input
                                    class="width-2"
                                    v-model="videoName"
                                    clearable
                                    placeholder="请输入视频名称关键字"
                                    v-search="handleSearch"
                                ></el-input>
                                <el-button class="search-btn" type="primary" @click="handleSearch()">查询</el-button>
                            </div>
                            <div>
                                <el-table v-loading="loadingVideo" :data="videoListData" style="width: 100%">
                                    <el-table-column align="center" prop="name" label="视频名称">
                                        <template slot-scope="scope">
                                            <el-tooltip
                                                v-if="scope.row.name.replace(/\s+/g, '').length > 20"
                                                :content="scope.row.name"
                                                placement="top"
                                            ></el-tooltip>
                                            <span
                                                style="
                                                    display: -webkit-box;
                                                    text-overflow: ellipsis;
                                                    overflow: hidden;
                                                    -webkit-line-clamp: 1;
                                                    -webkit-box-orient: vertical;
                                                    white-space: pre-line;
                                                "
                                                class="video-name"
                                                @click="play(scope.row.url)"
                                                ><i class="el-icon-video-play"></i> {{ scope.row.name }}</span
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="teacherName" label="教师">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.teacherName ? scope.row.teacherName : '——' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-link
                                                    :disabled="addEditInfo.videoId === scope.row.id"
                                                    :underline="false"
                                                    type="primary"
                                                    @click="handleAddTotalData(scope.row, 2)"
                                                    >添加</el-link
                                                >
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="table-page">
                                <el-pagination
                                    layout="prev, pager, next"
                                    @current-change="videoPageChange"
                                    :current-page="pageNumber"
                                    :page-count="page"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-dialog>
            <el-dialog
                title="播放"
                :append-to-body="true"
                :close-on-click-modal="false"
                :visible.sync="playVisible"
                :before-close="closePlay"
                width="fit-content"
                center
            >
                <div id="videoFilm" ref="videoFilm"></div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import Player from 'xgplayer';
import nullimg from '../../../../assets/imgs/home-null.png';
import {Message} from 'element-ui';
import vueQr from 'vue-qr';
import {baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    components: {vueQr},
    props: {
        userInfo: {
            type: Object,
            default: null,
        },
        userType: {
            type: Number,
        },
    },
    data() {
        return {
            permission: '',
            aiNum: 0,
            upErrorMsg: '',
            upErrorShow: false,
            videoSizet: '',
            videoSizes: '',
            playUrl: '',
            videoId: 1,
            teacherVideo: [],
            studentVideo: [],
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            feeModel: JSON.parse(localStorage.getItem('sysInfo')).type,
            classTypeList: [],
            addShow: false,
            detailData: {},
            evaluationTems: false,
            evaluationReport: {},
            reportAiList: [],
            reportList: [],
            aiStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
            reportShow: false,
            mobilePlayUrl: '',
            detailInfo: {},
            qrcodeShow: false,
            gradeList: [],
            classList: [],
            nullimg: nullimg,
            evaluationTemplateList: [],
            videoList: [],
            liveList: [],
            loadingW: false,
            videoSeekT: '',
            liveKey: '',
            pageNumL: 1,
            pagesL: 0,
            pagesT: 0,
            pageNumT: 1,
            activeName: 'first',
            chooseCpm: false,
            objectName: '',
            objectVideoName: '', // 绑定视频名称
            radio1: 1, // 1人工/2AI+人工评价
            radio2: 2,
            submitRow: {},
            submitShow: false,
            deleteRow: {},
            deleteShow: false,
            loadingBtn: false,
            loadingBtnOne: false,
            fileList: [],
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            edufileList: [], // 已上传文件
            groupList: [],
            type: 1,
            actives: this.userType == 0 ? 3 : 1,
            pageNum: 1,
            pages: 0,
            total: 0,
            uploadUrl: baseUrl + '/sm/label/save',
            list: [],
            themeValue: '',
            themeTypeList: [],
            userName: JSON.parse(window.localStorage.getItem('userInfo'))
                ? JSON.parse(window.localStorage.getItem('userInfo')).nickName
                : '',
            addEditInfo: {
                name: '', // 评课
                teacherId: JSON.parse(window.localStorage.getItem('userInfo'))
                    ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                    : '',
                startTime: '',
                endTime: '',
                groupId: '', // 评课组id
                objectId: '', // 绑定主题id
                videoId: '', // 绑定的视频id
                type: '', // 类型 0主题 1视频
                templateList: [], // 评课模板id
                evaluationGrade: '',
                evaluationClass: '',
                liveStartTime: '',
                liveEndTime: '',
                durationMinutes: '',
                terminalIdList: '',
                teacherVideo: '',
                studentVideo: '',
                classTypeId: '',
                recordingMethod: 0,
            },
            schoolList: [], // 可选择的学校
            buildlList: [], // 可选的教学楼
            classroomList: [], // 可选的教室
            terminalIdList: [], //可选的 直播设备 数组
            teachingFileIds: [], // 一键发布时上传文件数组
            resettingShow: false,
            resettingVal: {},
            themeData:
                JSON.parse(localStorage.getItem('userInfo')).famous == 1
                    ? [
                          {
                              id: 8,
                              name: '教师研修',
                          },
                          {
                              id: 2,
                              name: '课堂回顾',
                          },
                          {
                              id: 3,
                              name: '停课不停学',
                          },
                          {
                              id: 7,
                              name: '名师课堂',
                          },
                      ]
                    : [
                          {
                              id: 8,
                              name: '教师研修',
                          },
                          {
                              id: 2,
                              name: '课堂回顾',
                          },
                          {
                              id: 3,
                              name: '停课不停学',
                          },
                      ],
            defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
            loadingVideo: false, // 视频列表加载
            tooltipContent: '为巡课时录制完成并存储在系统的视频',
            videoListData: [], // 录制视频列表数据
            videoPermission: '', // 录制视频权限
            videoShow: false,
            videoActiveName: 'first',
            videoName: '',
            page: 0,
            pageNumber: 1,
            totalS: '',
            playVisible: false, // 视频播放窗口
            myVideo: null,
            recordingMethodList: [
                {name: '自动录制', id: 0},
                {name: '手动录制', id: 1},
            ],
            terminalName: '',
            isEdit: false,
            isTranslationPending: false,
        };
    },
    computed: {
        ...mapState({
            aiUploadTable: 'aiUploadTable',
        }),
    },
    mounted() {
        this.getLists();
        this.getCategoryList();
        this.getSchoolList(); //获取学校列表
        this.getgroupList(); //获取用户组列表
        this.getTemplateList();
    },
    methods: {
        ...mapActions({
            commitAiUploadBoxVisible: 'commitAiUploadBoxVisible',
            commitAiUploadTable: 'commitAiUploadTable',
            commitAiUploadDataState: 'commitAiUploadDataState',
        }),
        getCount() {
            this.$axios.get('/aiGrinding/getCount').then((res) => {
                if (res.code != 200) {
                    return;
                }
            });
        },
        removes() {
            this.studentVideo = [];
            this.addEditInfo.studentVideo = '';
        },
        removet() {
            this.teacherVideo = [];
            this.addEditInfo.teacherVideo = '';
        },
        getMp4Time(file) {
            return new Promise(async (resolve, reject) => {
                let url = URL.createObjectURL(file);
                let audioElement = new Audio(url);
                let durtaion = 0;
                // 下面需要注意的是在监听loadedmetadata绑定的事件中对duration直接进行赋值是无效的，需要在fun回调函数中进行赋值
                audioElement.addEventListener('loadedmetadata', function () {
                    //音频/视频的元数据已加载时，会发生 loadedmetadata 事件
                    durtaion = audioElement.duration; //时长以秒作为单位
                    fun(parseFloat(durtaion).toFixed(1));
                });
                let fun = (s) => {
                    durtaion = s;
                    resolve(durtaion);
                };
            });
        },
        async selectVideot(file) {
            this.playUrl = URL.createObjectURL(file.raw);
            let reg = /(.mp4|.MP4)$/;
            if (!reg.test(file.raw.name)) {
                this.$message(this.aiType == 1 ? '教师画面视频请上传MP4格式' : '请上传MP4格式视频', 'error');
                this.teacherVideo = [];
                this.addEditInfo.teacherVideo = '';
                return;
            }
            this.videoSizet =
                file.raw.size / 1024 / 1024 / 1024 > 1
                    ? `${(file.raw.size / 1024 / 1024 / 1024).toFixed(2)}G`
                    : `${(file.raw.size / 1024 / 1024).toFixed(2)}M`; //上传列表大小显示
            let time = await this.getMp4Time(file.raw);
            if (file.raw.size / 1024 / 1024 / 1024 > 1.8) {
                this.teacherVideo = [];
                return this.$message(
                    this.aiType == 1 ? '教师画面视频大小不能超过1.8G' : '视频大小不能超过1.8G',
                    'error'
                );
            } else if (time > 3600) {
                this.teacherVideo = [];
                return this.$message(
                    this.aiType == 1 ? '教师画面视频时长不能超过60分钟' : '视频时长不能超过60分钟',
                    'error'
                );
            } else {
                this.videoId = 1;
                this.initVP();
                this.addEditInfo.teacherVideo = file.raw;
            }
        },
        async selectVideos(file) {
            this.playUrl = URL.createObjectURL(file.raw);
            let reg = /(.mp4|.MP4)$/;
            if (!reg.test(file.raw.name)) {
                this.$message('学生画面视频请上传MP4格式', 'error');
                this.studentVideo = [];
                this.addEditInfo.studentVideo = '';
                return;
            }
            this.videoSizes =
                file.raw.size / 1024 / 1024 / 1024 > 1
                    ? `${(file.raw.size / 1024 / 1024 / 1024).toFixed(2)}G`
                    : `${(file.raw.size / 1024 / 1024).toFixed(2)}M`; //上传列表大小显示
            let time = await this.getMp4Time(file.raw);
            if (file.raw.size / 1024 / 1024 / 1024 > 3) {
                this.studentVideo = [];
                return this.$message('学生画面视频大小不能超过3G', 'error');
            } else if (time > 3600) {
                this.studentVideo = [];
                return this.$message('学生画面视频时长不能超过60分钟', 'error');
            } else {
                this.videoId = 2;
                this.initVP();
                this.addEditInfo.studentVideo = file.raw;
            }
        },
        initVP() {
            this.vp = new Player({
                id: 'vp',
                url: this.playUrl,
                fluid: true,
                autoplay: true,
                autoplayMuted: true,
                volume: 0,
                defaultMuted: true,
                videoInit: true,
                closeVideoClick: true,
                closeVideoTouch: true,
                errorTips: '暂无视频源',
                lang: 'zh-cn',
            });
            // debugger
            this.$nextTick(() => {
                let vp = document.querySelector('#vp>video');
                vp.style.zIndex = -100;
                vp.addEventListener('loadeddata', this.captureImage);
            });
        },
        // 捕获第一帧画面
        captureImage() {
            let vp = document.querySelector('#vp>video');
            let canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            canvas.width = vp.videoWidth * 0.8;
            canvas.height = vp.videoHeight * 0.8;
            canvas.getContext('2d').drawImage(vp, 0, 0, canvas.width, canvas.height);
            let img;
            if (this.videoId == 1) {
                img = document.querySelector(
                    '.teacher>.upload-demo>.el-upload-list--picture>.el-upload-list__item>.el-upload-list__item-thumbnail'
                );
            } else {
                img = document.querySelector(
                    '.student>.upload-demo>.el-upload-list--picture>.el-upload-list__item>.el-upload-list__item-thumbnail'
                );
            }
            img.src = canvas.toDataURL('image/png', 1);
            this.vp.destroy();
            this.vp = null;
            document.body.removeChild(canvas);
        },
        handleOnExceeds(files, fileList) {
            this.$message('只能上传一个视频', 'error');
        },
        getClassTypeList(val) {
            if (this.aiStatus !== 1) {
                return;
            }
            this.$axios.get('/aiGrinding/getClassType').then((res) => {
                this.classTypeList = res.data;
                if (val == 1) {
                    this.addEditInfo.classTypeId = res.data[0].id;
                }
            });
        },
        goEdit(val) {
            if (this.aiType == 2 && val == 2) {
                this.getCount();
            }
            this.getUseList();
            this.radio1 = val;
            this.radio2 = 2;
            this.themeValue = '';
            this.themeTypeList = [];
            this.edufileList = [];
            this.teachingFileIds = [];
            this.fileList = [];
            this.objectName = '';
            this.addEditInfo = {
                name: '', // 评课
                teacherId: JSON.parse(window.localStorage.getItem('userInfo'))
                    ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                    : '',
                startTime: '',
                endTime: '',
                groupId: '', // 评课组id
                objectId: '', // 绑定主题id
                type: '', // 类型 0主题 1视频
                templateList: [], // 评课模板id
                evaluationGrade: '',
                evaluationClass: '',
                classTypeId: '',
                recordingMethod: 0,
            };
            this.addShow = false;
            this.type = 2;
            this.getClassTypeList(1);
        },
        clearTerminal() {
            this.addEditInfo.terminalIdList = '';
            if (this.addEditInfo.classroomId) {
                this.classroomChange(1);
            }
        },
        // 更改课堂时长
        changeDurationMin() {
            this.calcEndTime();
            if (this.addEditInfo.grindingClassroom) {
                this.classroomChange(1);
            }
        },
        // 计算课堂结束时间
        calcEndTime() {
            if (this.addEditInfo.durationMinutes) {
                if (this.addEditInfo.durationMinutes == 0) {
                    this.$message('课堂时长不能为0', 'error');
                    return;
                }
                if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                    this.$message('课堂时长只能输入正整数', 'error');
                    return;
                }
            }
            if (!this.addEditInfo.liveStartTime || !this.addEditInfo.durationMinutes) {
                this.addEditInfo.liveEndTime = '';
                return;
            }
            this.addEditInfo.liveEndTime = this.$comjs.addMinutesByTimestamp(
                this.addEditInfo.liveStartTime,
                this.addEditInfo.durationMinutes
            );
            console.log('获取到的结束时间---', this.addEditInfo.endTime);
        },
        changeType() {
            this.addEditInfo.objectId = '';
            this.objectName = '';
        },
        getGradeLists() {
            this.getTeachBuildList(this.addEditInfo.orgId);
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
                this.$axios
                    .get('/index/personal/comment/getCommentSummarizeReport', {
                        id: val.id,
                    })
                    .then((res) => {
                        this.evaluationReport = res.data;
                        this.evaluationTems = true;
                    });
            } else {
                if (this.detailData.aiStatus == 3) {
                    this.$message('报告生成失败，请联系管理员！');
                } else {
                    if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                        window.open('/commentReport?id=' + this.detailData.id, '_blank');
                    } else {
                        window.open(this.detailData.aiReport, '_blank');
                    }
                }
            }
        },
        openReport(val) {
            if (val.status == 3) {
                return;
            }
            this.$axios.get('/sm/comment/info', {id: val.id}).then((res) => {
                this.detailData = res.data;
            });
            this.$axios
                .get('/index/personal/comment/report', {
                    id: val.id,
                })
                .then((res) => {
                    if (res.code == 200) {
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
                        this.reportShow = true;
                    }
                });
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
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
                        shareLink = location.origin + '/pplay?themeid=' + this.detailInfo.objectId + '&vtype=1&type=0';
                    } else {
                        shareLink = location.origin + '/hplay?themeid=' + this.detailInfo.objectId + '&vtype=1&type=0';
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
            //   let dataURL = canvas.toDataURL("image/png");
            //   let a = document.createElement('a');
            //   let event = new MouseEvent('click');
            //   a.download = this.detailInfo.name;
            //   a.href = dataURL
            //   a.dispatchEvent(event);
            // });
        },
        handleCloses() {
            this.evaluationReport = {};
            this.evaluationTems = false;
        },
        openQrcodeShow(val) {
            console.log(val, '666');
            if (val.type == 0) {
                this.mobilePlayUrl = location.origin + '/mobile/hplay&themeid=' + val.objectId + '&type=0';
            } else {
                this.mobilePlayUrl = location.origin + '/mobile/pplay&themeid=' + val.objectId + '&type=0';
            }
            this.$axios.get('/index/personal/comment/info', {id: val.id}).then((res) => {
                this.detailInfo = res.data;
                console.log('res.data.resources: ', res.data.resources);
                if (res.data.resources == 5 || res.data.resources == 1) {
                    console.log('res.data.objectId: ', res.data.objectId);
                    console.log('addEditInfo.videoId: ', this.addEditInfo.videoId);
                    console.log('addEditInfo.objectId: ', this.addEditInfo.objectId);
                    this.addEditInfo.videoId = res.data.objectId;
                    this.addEditInfo.objectId = res.data.objectId;
                }
                this.qrcodeShow = true;
            });
        },
        goDetail(val) {
            console.log('type: ' + val.type + ' resources: ' + val.resources);
            if (val.type == 0) {
                if (val.status !== 3 && val.status !== 4 && val.status !== 5) {
                    return;
                }
                if (val.liveStatus == 1 || val.liveStatus == 0) {
                    window.open(
                        '/hplay?themeid=' + val.objectId + '&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''),
                        '_blank'
                    );
                }
                if (val.liveStatus == 2) {
                    window.open(
                        '/pplay?themeid=' + val.objectId + '&type=0&vtype=1' + (val.resources == 2 ? '&etype=1' : ''),
                        '_blank'
                    );
                }
            } else {
                if (val.resources == 3 || val.resources == 4 || val.resources == 5) {
                    window.open('/Hplays?themeid=' + val.id, '_blank');
                } else {
                    window.open(
                        '/vplay?themeid=' + val.objectId + '&type=2&vtype=1' + (val.resources == 2 ? '&etype=1' : ''),
                        '_blank'
                    );
                }
            }
        },
        changeGrade() {
            this.addEditInfo.evaluationClass = '';
            this.getClassList();
        },
        changeClass() {
            this.$forceUpdate();
        },
        getCategoryList() {
            this.$axios.get('/sm/category/listAll?type=2').then((res) => {
                this.themeData = res.data;
            });
        },
        getGradeList(id) {
            this.$axios.get('/aiGrinding/getGrade?orgId=' + id + '').then((res) => {
                this.gradeList = res.data;
            });
        },
        getClassList() {
            this.$axios.get('/aiGrinding/getClass?id=' + this.addEditInfo.evaluationGrade).then((res) => {
                this.classList = res.data;
            });
        },
        getLists() {
            let data = {
                pageNum: this.pageNum,
                pageSize: 5,
                dataSources: this.actives,
            };
            this.$axios.get('/index/personal/comment/list', data).then((ress) => {
                this.permission = this.creatPermit(ress.data.permit);
                if (this.permission.participate) {
                    this.actives = 3;
                }
                if (this.permission.initiate) {
                    this.actives = 1;
                }
                if (!this.permission.participate && !this.permission.initiate) {
                    return;
                }
                this.$axios
                    .get('/index/personal/comment/list', {
                        pageNum: this.pageNum,
                        pageSize: 5,
                        dataSources: this.actives,
                    })
                    .then((res) => {
                        this.list = res.data.pageList;
                        this.pages = res.data.pages;
                        this.total = res.data.total;
                    });
            });
        },
        getList() {
            this.$axios
                .get('/index/personal/comment/list', {
                    pageNum: this.pageNum,
                    pageSize: 5,
                    dataSources: this.actives,
                })
                .then((res) => {
                    if (res.data.permit.length > 0) {
                        this.permission = this.creatPermit(res.data.permit);
                    } else {
                        this.permission = [];
                    }
                    this.list = res.data.pageList;
                    this.pages = res.data.pages;
                    this.total = res.data.total;
                });
        },
        getTemplateList() {
            this.$axios.get('/sm/template/listAll').then((res) => {
                this.evaluationTemplateList = res.data;
            });
        },
        bindTheme() {
            this.pageNumL = 1;
            this.handleLive();
            this.chooseCpm = true;
        },
        // 选择绑定主题显示
        handleAddDataList(data, type) {
            this.addEditInfo.type = type;
            this.addEditInfo.objectId = data.id;
            this.objectName = data.name;
            this.chooseCpm = false;
        },
        handleCloseTag() {
            this.addEditInfo.objectId = '';
            this.objectName = '';
        },
        pageChangeL(val) {
            this.pageNumL = val;
            // this.pages = 1;
            this.handleLive();
        },
        pageChangeT(val) {
            this.pageNumT = val;
            // console.log(val);
            this.handleVideo();
        },
        handleTab() {
            if (this.activeName === 'first') {
                this.pageNumL = 1;
                this.handleLive();
            } else {
                this.pageNumT = 1;
                this.handleVideo();
            }
        },
        // 直播查询
        searchLive() {
            this.pageNumL = 1;
            this.handleLive();
        },
        // 视频查询
        handleSearchT() {
            this.pageNumT = 1;
            this.handleVideo();
        },
        // 直播列表数据
        handleLive() {
            this.loadingW = true;
            let url;
            if (this.radio1 == 1) {
            } else {
                url = '/sm/comment/listTheme';
            }
            this.$axios
                .get('/sm/comment/listTheme', {
                    // commentGroup: this.addEditInfo.groupId,
                    id: this.addEditInfo.id ? this.addEditInfo.id : '',
                    keyWord: this.liveKey,
                    pageNum: this.pageNumL,
                    pageSize: 8,
                    evaluationType: this.radio1 == 2 ? 2 : 1,
                })
                .then((res) => {
                    this.loadingW = false;
                    this.liveList = res.data.pageList;
                    this.pagesL = res.data.pages;
                });
        },
        // 视频列表数据
        handleVideo() {
            this.loadingW = true;
            this.$axios
                .get('/sm/comment/listFile', {
                    // commentGroup: this.addEditInfo.groupId,
                    id: this.addEditInfo.id ? this.addEditInfo.id : '',
                    keyWord: this.videoSeekT,
                    pageNum: this.pageNumT,
                    pageSize: 8,
                })
                .then((res) => {
                    this.loadingW = false;
                    this.videoList = res.data.pageList;
                    this.pagesT = res.data.pages;
                });
        },
        handleClose() {
            this.videoSeekT = '';
            this.liveKey = '';
            this.activeName = 'first';
            this.chooseCpm = false;
        },
        judgeEndTime(time) {
            if (getNowDate() > time) {
                this.$message('送审失败，听评课活动结束时间需大于当前时间', 'error');
                return true;
            }
            return false;
        },
        judgeEndTimes(time) {
            if (getNowDate() > time) {
                this.$message('送审失败，听评课活动课堂开始时间需大于当前时间', 'error');
                return true;
            }
            return false;
        },
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
                this.$axios.get('/index/personal/comment/submit', {id: this.submitRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.submitShow = false;
                        this.$message('送审成功', 'success');
                        this.getList();
                    }
                });
            }
        },
        editData(val) {
            this.isEdit = true;
            if (this.aiType == 2 && val.evaluationType == 2) {
                this.getCount();
            }
            if (this.aiUploadTable.length > 0) {
                let check = this.aiUploadTable.find((el) => {
                    return el.type == 1 && el.detail.get('id') == val.id;
                });
                if (check) {
                    return this.$message('该评课正在编辑中，请稍后再试', 'success');
                }
            }
            this.$axios.get('/index/personal/comment/info', {id: val.id}).then((res) => {
                for (let key in this.addEditInfo) {
                    this.addEditInfo[key] = res.data[key];
                }
                this.radio1 = res.data.evaluationType;
                this.radio2 = res.data.resources;
                if (res.data.teachingFileList) {
                    this.edufileList = res.data.teachingFileList;
                    this.teachingFileIds = this.edufileList.map((i) => i.id);
                } else {
                    this.edufileList = [];
                    this.teachingFileIds = [];
                }
                if (res.data.coverUrl) {
                    this.fileList = [{name: '', url: res.data.coverUrl}];
                    this.addEditInfo.file = res.data.coverUrl;
                } else {
                    this.addEditInfo.file = '';
                    this.fileList = [];
                }
                this.addEditInfo.id = res.data.id;
                this.addEditInfo.status = res.data.status;
                this.addEditInfo.evaluationOrgId = res.data.evaluationOrgId;
                this.addEditInfo.orgId = res.data.evaluationOrgId;
                if (res.data.resources == 1) {
                    this.objectName = res.data?.smTheme?.name;
                    console.log('res.data.objectId: ', res.data.objectId);
                    this.addEditInfo.videoId = res.data?.smTheme?.id;
                    this.addEditInfo.objectId = res.data?.smTheme?.id;
                    console.log('addEditInfo.videoId: ', this.addEditInfo.videoId);
                    console.log('addEditInfo.objectId: ', this.addEditInfo.objectId);
                } else if (res.data.resources == 2) {
                    this.addEditInfo.objectId = '';
                    this.addEditInfo.liveStartTime = res.data.smTheme.startTime;
                    this.addEditInfo.liveEndTime = res.data.smTheme.endTime;
                    this.addEditInfo.terminalIdList = res.data.terminalList[0].terminalId;
                    this.addEditInfo.buildingId = res.data.buildingId;
                    this.addEditInfo.classroomId = res.data.classroomId;
                    this.getTeachBuildList(res.data.evaluationOrgId);
                    this.getClassroomList(res.data.buildingId);
                    this.getTerminalIdList();
                    this.$set(
                        this.addEditInfo,
                        'durationMinutes',
                        this.$comjs.createDuraTionMin(this.addEditInfo.liveStartTime, this.addEditInfo.liveEndTime)
                    );
                } else if (res.data.resources == 4) {
                    this.addEditInfo.liveStartTime = res.data.smTheme.startTime;
                    this.addEditInfo.liveEndTime = res.data.smTheme.endTime;
                    this.objectVideoName = res.data.objectName;
                    this.$set(
                        this.addEditInfo,
                        'durationMinutes',
                        this.$comjs.createDuraTionMin(this.addEditInfo.liveStartTime, this.addEditInfo.liveEndTime)
                    );
                } else {
                    console.log('res.data.resources: ', res.data.resources);
                    if (res.data.resources == 5) {
                        console.log('res.data.objectId: ', res.data.objectId);
                        console.log('addEditInfo.videoId: ', this.addEditInfo.videoId);
                        console.log('addEditInfo.objectId: ', this.addEditInfo.objectId);
                        this.addEditInfo.videoId = res.data.objectId;
                        this.addEditInfo.objectId = res.data.objectId;
                    }
                    // this.addEditInfo.objectId = "";
                    this.teacherVideo = [{name: '', url: res.data.teacherVideoUrl}];
                    this.addEditInfo.teacherVideo = res.data.teacherVideoUrl;
                    this.objectVideoName = res.data.objectName;
                    setTimeout(() => {
                        this.playUrl = res.data.teacherVideoUrl;
                        this.videoId = 1;
                        this.initVP();
                    }, 300);
                    if (res.data.aiConfigId == 1) {
                        this.studentVideo = [{name: '', url: res.data.studentVideoUrl}];
                        this.addEditInfo.studentVideo = res.data.studentVideoUrl;
                        setTimeout(() => {
                            this.playUrl = res.data.studentVideoUrl;
                            this.videoId = 2;
                            this.initVP();
                        }, 800);
                    }
                }
                this.themeValue = parseInt(res.data.category); // 获取编辑id赋给一级分类select
                let arr = [];
                res.data.templatesList.forEach((el) => {
                    arr.push(el.id);
                });
                this.addEditInfo.templateList = arr;
                this.getGradeList(res.data.evaluationOrgId);
                this.getCategoryList();
                if (res.data.evaluationGrade) {
                    this.getClassList();
                }
                this.getClassTypeList(2);
                if (this.themeValue !== '') {
                    // this.getTypeList();
                    this.themeTypeList = res.data.categoryList;
                }
                this.type = 2;
                if (this.addEditInfo.status == 1) {
                    this.isTranslationPending = true;
                }
            });
        },
        //删除 0删除 1删除确定
        deleteData(type, val) {
            if (type == 0) {
                this.deleteRow = val;
                this.deleteShow = true;
            } else {
                this.$axios
                    .post('/index/personal/comment/delete', {
                        objectId: this.deleteRow.objectId,
                        id: this.deleteRow.id,
                        type: this.deleteRow.type,
                    })
                    .then((res) => {
                        if (res.code == 200) {
                            this.deleteShow = false;
                            this.$message('删除成功', 'success');
                            this.total = this.total - 1;
                            if (this.pageNum * 5 - this.total === 5) {
                                this.pageNum = this.pageNum - 1 || 1;
                            }
                            this.getList();
                        }
                    });
            }
        },
        //重置分析弹窗
        resetting() {
            if (this.detailData.isResetting != 0) {
                return;
            }
            this.resettingVal = this.detailData;
            this.resettingShow = true;
        },
        addLive(val) {
            if (val == 1) {
                this.type = 1;
                this.getList();
            } else {
                this.isEdit = false;
                this.teacherVideo = [];
                this.studentVideo = [];
                if (this.aiStatus == 1) {
                    this.addShow = true;
                    this.addEditInfo.objectId = '';
                } else {
                    this.radio1 = 1;
                    this.type = 2;
                    this.themeValue = '';
                    this.themeTypeList = [];
                    this.edufileList = [];
                    this.teachingFileIds = [];
                    this.fileList = [];
                    this.objectName = '';
                    this.addEditInfo = {
                        name: '', // 评课
                        teacherId: JSON.parse(window.localStorage.getItem('userInfo'))
                            ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                            : '',
                        startTime: '',
                        endTime: '',
                        groupId: '', // 评课组id
                        objectId: '', // 绑定主题id
                        type: '', // 类型 0主题 1视频
                        templateList: [], // 评课模板id
                        evaluationGrade: '',
                        evaluationClass: '',
                        classTypeId: '',
                        recordingMethod: 0,
                    };
                    this.getUseList();
                    this.getClassTypeList(1);
                }
            }
        },
        changeTab(type) {
            this.actives = type;
            this.pageNum = 1;
            this.getList();
        },
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        // 移除文件
        handleRemove(file, fileList) {
            console.log('移除文件：', file);
            console.log('移除文件列表：', fileList);
            if (fileList.length == 0) {
                this.teachingFileIds = [];
            }
        },
        // 文件数量限制
        handleExceed(files, fileList) {
            this.$message(`当前限制选择 5 个文件`, 'error');
        },
        // 移除文件之前
        beforeRemove(file, fileList) {
            const max = 1024 * 1024; // 1M
            if (file.size / max > 50) {
                return true;
            } else {
                // return this.$confirm(`确定移除该文件吗？`, '删除提示', {
                //   confirmButtonText: '确定',
                //   cancelButtonText: '取消',
                //   type: 'warning'
                // }).then(() => {
                if (file.percentage && file.percentage !== 100) {
                    // 未上传成功取消请求
                    this.$refs.edufileupload.abort();
                    return true;
                }
                if (this.addEditInfo.id) {
                    // 存再themeId 即为编辑   // 删除不调用删除接口
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == file.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                        if (file.response && item == file.response.data.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                    return true;
                } else {
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == file.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                        if (file.response && item == file.response.data.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                    return true;
                    // 不为编辑，// 删除调用删除接口
                    // let id = file.response.data.id
                    // this.deleteEduFile(id);
                }
                // }).catch(() => reject());
            }
        },
        // edu上传之前
        eduBeforeupload(file) {
            let isJpg;
            if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.$message('上传失败，文件格式错误', 'error');
                // this.edufileList = [];
                return false;
            }
            const max = 1024 * 1024; // 1M
            if (file.size / max > 50) {
                this.$message('单个文件不得超过50M', 'error');
                return false;
            }
        },
        // 上传文件的错误回调
        handleEduError(error, file, fileList) {
            let errorM = JSON.parse(error.message);
            this.$message(errorM.message, 'error');
        },
        // 上传文件的成功回调
        handleEduSuccess(response, file, fileList) {
            // console.log(response, file, fileList,this.teachingFileIds)
            if (response.code == 200) {
                this.teachingFileIds.push(response.data.id);
            }
        },
        // 删除上传的文件
        deleteEduFile(id) {
            this.$axios.post('/upload/deleteTeachingFile', {id: id}).then((res) => {
                if (res.code == 200) {
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                }
            });
        },
        //获取用户组列表
        getgroupList() {
            this.$axios
                .get('/sm/comment/listGroup', {
                    filterateGroup: 1,
                })
                .then((res) => {
                    this.groupList = res.data;
                });
        },
        pageChange(val) {
            this.pageNum = val;
            this.getList();
        },
        handleTheme() {
            // this.addEditInfo.teacherId = '';
            this.getTeacherList();
            this.getTypeList();
        },
        getTeacherList() {
            this.$axios.get('/sm/interactive/getUser', {famous: 0}).then((res) => {
                this.teacherList = res.data;
            });
        },
        getTypeList() {
            this.$axios
                .get('/aiGrinding/getSmLabel', {
                    id: this.themeValue,
                })
                .then((res) => {
                    this.themeTypeList = res.data;
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
        //上传的封面
        selectFile(file) {
            let isJpg;
            if (file.raw.type == 'image/jpeg' || file.raw.type == 'image/png' || file.raw.type == 'image/jpg') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.fileList = [];
                return this.$message('上传失败，文件格式错误', 'error');
            }
            if (file.raw.size / 1024 > 500) {
                this.fileList = [];
                return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
            } else {
                this.addEditInfo.file = file.raw;
            }
        },
        //获取学校列表
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
                // if (this.schoolList.length > 0) {
                // 	this.addEditInfo.orgId = this.schoolList[0].id;
                this.getTeacherList();
                // 	if (this.addEditInfo.orgId) {
                // 		this.getTeachBuildList(this.addEditInfo.orgId);
                // 	}
                // }
            });
        },
        //根据学校id获取教学楼列表
        getTeachBuildList(orgId) {
            this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then((res) => {
                this.buildlList = res.data;
                // if (this.buildlList.length > 0) {
                // 	this.addEditInfo.buildingId = this.buildlList[0].id;
                // 	if (this.addEditInfo.buildingId) {
                // 		this.getClassroomList(this.addEditInfo.buildingId);
                // 	}
                // }
            });
        },
        //根据教学楼id获取教室列表
        getClassroomList(buildingId) {
            this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then((res) => {
                this.classroomList = res.data;
                // if (this.classroomList.length > 0) {
                // 	this.addEditInfo.classroomId = this.classroomList[0].id;
                // }
            });
        },
        //选择学校后 教学楼、教室修改
        shcoolChange(id) {
            // this.recodeList = [];
            this.buildlList = [];
            this.addEditInfo.evaluationGrade = '';
            this.addEditInfo.evaluationClass = '';
            this.addEditInfo.buildingId = '';
            this.addEditInfo.classroomId = '';
            this.terminalName = '';
            this.classroomList = [];
            this.classroomChange();
            this.getGradeList(id);
            this.getTeachBuildList(id);
        },
        //教学楼改变后教室修改
        buildChange(id) {
            // this.recodeList = [];
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.classroomChange();
            this.getClassroomList(id);
        },
        //教室改变后直播设备改变 录制机位改变
        classroomChange(type) {
            this.terminalName = '';
            this.terminalIdList = [];
            this.addEditInfo.terminalIdList = '';
            if (type) {
                this.getTerminalIdList('room');
            }
        },
        getTerminalIdList(room) {
            let data = {
                classroomId: this.addEditInfo.classroomId,
                startTime: this.addEditInfo.liveStartTime,
                endTime: this.addEditInfo.liveEndTime,
                type: 1,
                resources: this.radio2,
            };
            if (this.addEditInfo.id) {
                data.themeId = this.addEditInfo.id;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                // debugger
                this.terminalIdList = res.data;
                this.terminalName =
                    this.terminalIdList[0] && this.terminalIdList[0].terminalName
                        ? this.terminalIdList[0].terminalName
                        : '';
                if (!this.$route.query.themeid || room === 'room') {
                    // 新增
                    const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';
                    this.addEditInfo.terminalIdList = id ? id : '';
                }
            });
        },
        save(val) {
            if (!this.verify()) {
                let arrs = [];
                let arrays = [];
                this.aiUploadTable.forEach((el) => {
                    arrs.push(el.uploadId);
                });
                arrays = Array.from(new Set(arrs));
                if (arrays.length >= 5) {
                    return this.$message('最多可以同时上传5个评课或磨课，请稍后再试！', 'error');
                }
                let typeIdList = [];
                this.themeTypeList.forEach((v) => {
                    if (v.value !== null || v.value !== '') {
                        typeIdList.push(v.value);
                    }
                });
                let idList = [];
                this.themeTypeList.forEach((v) => {
                    if (v.value) {
                        idList.push(v.value);
                    }
                });
                if (
                    this.aiUploadTable.findIndex((item, i) => {
                        return (
                            item.name == this.addEditInfo.name + '教师画面' ||
                            (item.name == this.addEditInfo.name + '视频' && item.type == 1)
                        );
                    }) === -1
                ) {
                    let formData = new FormData();
                    let url = '/index/personal/comment/save';
                    let judgeData = {};
                    judgeData.name = this.addEditInfo.name;
                    if (this.addEditInfo.id) {
                        judgeData.id = this.addEditInfo.id;
                    }
                    this.$axios.post('/sm/comment/check', judgeData).then((res) => {
                        if (res.code == 200) {
                            formData.append('name', this.addEditInfo.name);
                            if (this.aiStatus == 1 && this.radio1 == 2) {
                                formData.append('classTypeId', this.addEditInfo.classTypeId);
                            }
                            formData.append('aiConfigId', this.aiType);
                            formData.append('category', this.themeValue);
                            formData.append('labelList', idList);
                            formData.append('startTime', this.addEditInfo.startTime);
                            formData.append('endTime', this.addEditInfo.endTime);
                            formData.append('teacherId', this.addEditInfo.teacherId);
                            formData.append('groupId', this.addEditInfo.groupId);
                            formData.append('templateList', this.addEditInfo.templateList);
                            formData.append('evaluationOrgId', this.addEditInfo.orgId);
                            formData.append('aiProjectId', this.addEditInfo.aiProjectId);
                            if (this.addEditInfo.file && this.addEditInfo.file.name) {
                                formData.append('file', this.addEditInfo.file ? this.addEditInfo.file : '');
                            } else {
                                formData.append('coverUrl', this.addEditInfo.file ? this.addEditInfo.file : '');
                            }
                            if (this.radio2 == 1) {
                                formData.append(
                                    'type',
                                    this.addEditInfo.type
                                        ? this.addEditInfo.type
                                        : this.chooseCpm == true && this.activeName !== 'first'
                                        ? 1
                                        : 0
                                );
                                formData.append('objectId', this.addEditInfo.objectId);
                                formData.append('resources', 1);
                            } else if (this.radio2 == 2) {
                                formData.append('type', 0);
                                formData.append('objectId', 0);
                                formData.append('resources', 2);
                                formData.append('themeStartTime', this.addEditInfo.liveStartTime);
                                formData.append('themeEndTime', this.addEditInfo.liveEndTime);
                                formData.append('orgId', this.addEditInfo.orgId);
                                formData.append('buildingId', this.addEditInfo.buildingId);
                                formData.append('classroomId', this.addEditInfo.classroomId);
                                formData.append('terminalIdList', this.addEditInfo.terminalIdList);
                            } else if (this.radio2 == 4) {
                                formData.append('type', 1);
                                formData.append('resources', 4);
                                formData.append('themeStartTime', this.addEditInfo.liveStartTime);
                                formData.append('themeEndTime', this.addEditInfo.liveEndTime);
                                formData.append('recordingMethod', this.addEditInfo.recordingMethod);
                                formData.append('buildingId', this.addEditInfo.buildingId);
                                formData.append('classroomId', this.addEditInfo.classroomId);
                            } else if (this.radio2 == 3) {
                                formData.append('type', 1);
                                formData.append('resources', 3);
                                if (
                                    this.addEditInfo.teacherVideo &&
                                    typeof this.addEditInfo.teacherVideo !== 'string'
                                ) {
                                    formData.append('teacherVideo', this.addEditInfo.teacherVideo);
                                    if (
                                        this.aiType == 1 &&
                                        this.addEditInfo.studentVideo &&
                                        typeof this.addEditInfo.studentVideo !== 'string'
                                    ) {
                                        formData.append('studentVideo', this.addEditInfo.studentVideo);
                                    }
                                }
                            } else {
                                formData.append('type', 2);
                                formData.append('recordId', this.addEditInfo.videoId);
                                formData.append('resources', 5);
                            }
                            if (this.teachingFileIds.length != 0) {
                                formData.append('planFile', this.teachingFileIds);
                            }
                            if (this.radio1 == 2) {
                                formData.append('evaluationType', 2);
                            } else {
                                formData.append('evaluationType', 1);
                            }
                            formData.append('evaluationGrade', this.addEditInfo.evaluationGrade);
                            formData.append('evaluationClass', this.addEditInfo.evaluationClass);
                            if (this.addEditInfo.id) {
                                url = '/index/personal/comment/update';
                                formData.append('id', this.addEditInfo.id);
                                formData.append('status', val && val == 1 ? 2 : this.addEditInfo.status);
                            } else {
                                formData.append('status', val && val == 1 ? 2 : 1);
                            }
                            // 判断编辑是否有替换视频
                            let uploadId;
                            if (this.radio2 == 3) {
                                if (
                                    typeof this.addEditInfo.teacherVideo !== 'string' &&
                                    this.addEditInfo.teacherVideo
                                ) {
                                    // 上传列表s
                                    uploadId = this.aiUploadTable.length;
                                    let uploadTbaleData = {
                                        type: 'push',
                                        item: {
                                            uploadId: uploadId,
                                            name:
                                                this.aiType == 1
                                                    ? this.addEditInfo.name + '教师画面'
                                                    : this.addEditInfo.name + '视频',
                                            status: 1, // 0 上传失败 1上传中 //2已取消
                                            size: this.videoSizet,
                                            type: 1, //1 评课 2 AI
                                            id: this.addEditInfo.id ? this.addEditInfo.id : -1, // 视频id
                                            detail: formData,
                                            fileName: this.addEditInfo.teacherVideo.name.slice(
                                                0,
                                                this.addEditInfo.teacherVideo.name.length - 4
                                            ),
                                            progress: 0,
                                        },
                                    };
                                    this.commitAiUploadTable(uploadTbaleData);
                                }
                                if (
                                    typeof this.addEditInfo.studentVideo !== 'string' &&
                                    this.addEditInfo.studentVideo
                                ) {
                                    // 上传列表s
                                    let uploadIds = this.aiUploadTable.length;
                                    let uploadTbaleData = {
                                        type: 'push',
                                        item: {
                                            uploadId: uploadIds - 1,
                                            name: this.addEditInfo.name + '学生画面',
                                            status: 1, // 0 上传失败 1上传中 //2已取消
                                            size: this.videoSizes,
                                            type: 1, //1 评课 2 AI
                                            id: this.addEditInfo.id ? this.addEditInfo.id : -1, // 视频id
                                            detail: formData,
                                            fileName: this.addEditInfo.studentVideo.name.slice(
                                                0,
                                                this.addEditInfo.studentVideo.name.length - 4
                                            ),
                                            progress: 0,
                                        },
                                    };
                                    this.commitAiUploadTable(uploadTbaleData);
                                }
                                this.getList();
                                this.type = 1;
                                if (
                                    this.addEditInfo.teacherVideo &&
                                    this.addEditInfo.teacherVideo !== null &&
                                    (typeof this.addEditInfo.teacherVideo !== 'string' ||
                                        typeof this.addEditInfo.studentVideo !== 'string')
                                ) {
                                    this.commitAiUploadBoxVisible(true);
                                }
                            }
                            this.$axios
                                .post(url, formData, {
                                    headers: {
                                        uploadId: uploadId,
                                    },
                                    timeout: 600000,
                                    onUploadProgress: (progressEvent) => {
                                        if (this.radio2 == 3) {
                                            // 这就是 真·上传进度
                                            let percent = Math.round(
                                                (progressEvent.loaded / progressEvent.total) * 100
                                            );
                                            let msg = {};
                                            if (
                                                typeof this.addEditInfo.teacherVideo !== 'string' &&
                                                this.addEditInfo.teacherVideo
                                            ) {
                                                msg = {
                                                    fileName: this.addEditInfo.teacherVideo.name.slice(
                                                        0,
                                                        this.addEditInfo.teacherVideo.name.length - 4
                                                    ),
                                                    progress: percent,
                                                };
                                            }
                                            if (
                                                typeof this.addEditInfo.studentVideo !== 'string' &&
                                                this.addEditInfo.studentVideo
                                            ) {
                                                msg = {
                                                    fileName: this.addEditInfo.studentVideo.name.slice(
                                                        0,
                                                        this.addEditInfo.studentVideo.name.length - 4
                                                    ),
                                                    progress: percent,
                                                };
                                            }
                                            this.$comjs.updateAiUploadTable(formData, msg);
                                        }
                                    },
                                })
                                .then(
                                    (res) => {
                                        if (res.code == 200) {
                                            console.log(formData.get('teacherVideo'), 'formData.get()');
                                            if (formData.get('teacherVideo') && formData.get('resources') == 3) {
                                                this.commitAiUploadTable({
                                                    type: 'splice',
                                                    detail: formData, // 视频id
                                                });
                                            } else {
                                                this.type = 1;
                                            }
                                            this.getList();
                                            this.addEditInfo.id
                                                ? this.$message('修改评课成功', 'success')
                                                : this.$message('新增评课成功', 'success');
                                        } else if (res.code == -3000) {
                                            this.upErrorMsg = res.message;
                                            this.upErrorShow = true;
                                        } else if (res.code == -10000) {
                                            if (this.addEditInfo.teacherVideo) {
                                                this.commitAiUploadTable({
                                                    type: 'splice',
                                                    detail: formData, // 视频id
                                                });
                                            }
                                            // this.editShow = false;
                                            // // 判断编辑是否有替换视频
                                            // if (this.addEditInfo.video) {
                                            //   this.commitAiUploadDataState({
                                            //     uploadId: uploadId,
                                            //     status: 0,
                                            //   });
                                            // }
                                        }
                                    },
                                    (err) => {
                                        if (err.message === '取消成功') {
                                            this.$message(err.message, 'success', 70, 3000);
                                        } else {
                                            this.$message(err.message, 'error', 70, 3000);
                                        }
                                    }
                                );
                        }
                    });
                } else {
                    this.$message('听评课名称重复，该评课正在上传', 'error');
                }
            }
        },
        // 选择视频资源
        handleAdd() {
            this.pageNumber = 1;
            this.videoName = '';
            this.videoShow = true;
            this.getVideoList();
        },
        // 获取视频列表数据
        getVideoList() {
            this.loadingVideo = true;
            this.$axios
                .get('/sm/record/listLessThanSixtyMinute', {
                    keyWord: this.videoName,
                    isAI: true,
                    pageNum: this.pageNumber,
                    pageSize: 10,
                })
                .then((res) => {
                    this.loadingVideo = false;
                    this.videoListData = res.data.pageList;
                    this.videoPermission = this.creatPermit(res.data.permit);
                    this.page = res.data.pages;
                    this.totalS = res.data.total;
                    this.pageNumber = res.data.pageNum;
                });
        },
        // 关闭绑定视频弹窗
        closeVideoShow() {
            this.videoName = '';
            this.videoActiveName = 'first';
            this.videoShow = false;
        },
        // 视频资源查询
        handleSearch() {
            this.pageNumber = 1;
            this.getVideoList();
        },
        // 播放视频
        play(url) {
            if (this.videoPermission.info) {
                this.playVisible = true;
                this.$nextTick(() => {
                    this.handelGetVideo(url);
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        // 关闭播放
        closePlay() {
            this.myVideo.src = null;
            this.playVisible = false;
        },
        // 视频初始化
        handelGetVideo(params) {
            if (this.myVideo !== null) {
                this.myVideo.destroy();
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url: params,
                    autoplay: true,
                    videoInit: true,
                    width: 460,
                    height: 270,
                    fitVideoSize: 'auto',
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            } else {
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url: params,
                    autoplay: true,
                    videoInit: true,
                    width: 460,
                    height: 270,
                    fitVideoSize: 'auto',
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            }
        },
        // 添加视频
        handleAddTotalData(row, type) {
            let minutes = parseInt(row.time.split(':')[1], 10);
            console.log(minutes, 'time个人中心听评课');
            if (minutes > 60) {
                this.$message('视频时长不能超过60分钟', 'error');
                return;
            }
            this.addEditInfo.type = type;
            this.addEditInfo.videoId = row.id;
            this.objectVideoName = row.name;
            this.videoShow = false;
        },
        // 减少视频
        handleCloseVideoTag(tag) {
            this.addEditInfo.videoId = '';
            this.objectVideoName = '';
        },
        //分页点击
        videoPageChange(val) {
            this.scrollTo0();
            this.pageNumber = val;
            this.getVideoList();
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('video-wrap')[0].scrollTo(0, 0);
        },
        //验证
        verify() {
            Message.closeAll();
            // 暂存编辑、新增需要判断剩余次数
            if ((this.isEdit && this.isTranslationPending) || !this.isEdit) {
                if (this.aiType == 2 && this.feeModel == 1 && this.radio1 == 2) {
                    if (this.aiNum == 0) {
                        this.$message('AI分析剩余次数不足！', 'error');
                        return true;
                    }
                    if (!this.addEditInfo.aiProjectId) {
                        this.$message('请选择优先使用的项目！', 'error');
                        return true;
                    }
                }
            }
            if (!this.addEditInfo.name) {
                this.$message('评课名称不能为空', 'error');
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 80)) {
                this.$message('评课名称由中文大小写字母数字组成，最长80位！', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('评课分类未选择', 'error');
                return true;
            }
            var ifResult = false;
            if (this.themeTypeList.length !== 0) {
                let ifType = this.themeTypeList.some((v, i) => {
                    if (v.value === null || v.value === '') {
                        this.$message(`${v.name}未选择`, 'error');
                        ifResult = false;
                        return true;
                    }
                    ifResult = true;
                });
            } else {
                ifResult = true;
            }
            if (!ifResult) {
                return true;
            }

            if (this.addEditInfo.startTime === '' || this.addEditInfo.startTime === null) {
                this.$message('评课开始时间不能为空', 'error');
                return true;
            }
            if (this.addEditInfo.endTime === '' || this.addEditInfo.endTime === null) {
                this.$message('请选择评课结束时间', 'error');
                return true;
            }
            if (this.addEditInfo.startTime < getNowDate()) {
                this.addEditInfo.startTime = getNowDate();
            }
            // if(new Date(this.addEditInfo.endTime).getTime() - new Date(this.addEditInfo.startTime).getTime() > 3600000){
            //   this.$message('时长需小于60分钟', 'error');
            //   return true;
            // }
            if (this.addEditInfo.endTime) {
                if (this.addEditInfo.endTime <= this.addEditInfo.startTime) {
                    this.$message('评课结束时间不能小于等于评课开始时间', 'error');
                    return true;
                }
            }
            if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
                this.$message('请选择学校', 'error');
                return true;
            }
            if (!this.addEditInfo.teacherId) {
                this.$message('授课教师不能为空', 'error');
                return true;
            }
            if (!this.addEditInfo.evaluationGrade) {
                this.$message('请选择年级', 'error');
                return true;
            }
            if (!this.addEditInfo.evaluationClass) {
                this.$message('请选择班级', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.groupId)) {
                this.$message('评课教师组不能为空', 'error');
                return true;
            }
            if (this.addEditInfo.templateList.length == 0) {
                this.$message('评课模板不能为空', 'error');
                return true;
            }
            if (this.radio1 == 2 && this.teachingFileIds.length == 0) {
                this.$message('教案必须上传！', 'error');
                return true;
            }
            if (this.radio2 == 1) {
                if (this.$verify.isEmpty(this.addEditInfo.objectId)) {
                    this.$message('课堂视频不能为空', 'error');
                    return true;
                }
            } else if (this.radio2 == 2 || this.radio2 == 4) {
                if (
                    this.addEditInfo.liveStartTime === '' ||
                    this.addEditInfo.liveStartTime === null ||
                    !this.addEditInfo.liveStartTime
                ) {
                    this.$message('请选择课堂开始时间', 'error');
                    return true;
                }
                if (!this.addEditInfo.durationMinutes) {
                    this.$message('课堂时长不能为空', 'error');
                    return true;
                }
                if (this.addEditInfo.durationMinutes) {
                    if (this.addEditInfo.durationMinutes == 0) {
                        this.$message('课堂时长不能为0', 'error');
                        return;
                    }
                    if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                        this.$message('课堂时长只能输入正整数', 'error');
                        return true;
                    }
                    if (this.addEditInfo.durationMinutes > 60) {
                        this.$message('课堂时长最多只能60分钟', 'error');
                        return true;
                    }
                }
                if (this.addEditInfo.liveStartTime < getNowDate()) {
                    this.$message('课堂开始时间须大于当前时间！', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.buildingId)) {
                    this.$message('请选择教学楼', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.classroomId)) {
                    this.$message('请选择教室', 'error');
                    return true;
                }
                if (this.radio2 == 2) {
                    if (this.$verify.isEmpty(this.addEditInfo.terminalIdList)) {
                        this.$message('请选择直播设备', 'error');
                        return true;
                    }
                }
            } else if (this.radio2 == 3) {
                console.log('this.teacherVideo', this.teacherVideo);
                if (
                    // !this.addEditInfo.id &&
                    this.$verify.isEmpty(this.addEditInfo.teacherVideo)
                ) {
                    this.$message(this.aiType == 1 ? '请上传教师画面视频' : '请上传视频', 'error');
                    return true;
                }
                if (
                    // !this.addEditInfo.id &&
                    this.aiType == 1 &&
                    this.$verify.isEmpty(this.addEditInfo.studentVideo)
                ) {
                    this.$message('请上传学生画面视频', 'error');
                    return true;
                }
            } else {
                if (this.$verify.isEmpty(this.addEditInfo.videoId)) {
                    this.$message('请选择课堂视频', 'error');
                    return true;
                }
            }
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
                        this.detailData.isResetting = 1;
                        this.$message(res.data, 'success');
                        this.getList();
                    }
                });
            });
        },
        getUseList() {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            let params = {};
            params['productType'] = 1;
            params['currentUserId'] = this.addEditInfo.teacherId;
            this.$comjs.getUseList(this, params);
        },
    },
};
</script>
<style lang="scss" type="text/scss" scoped>
.videoList {
    .upload-demo {
        width: 240px;
    }
    ::v-deep .el-upload-dragger {
        width: 240px;
    }
    ::v-deep .upload-demo .el-upload-list {
        width: 210px;
        margin: -160px 0 0 15px !important;
    }
}
.pagination-wrap {
    margin-top: 30px;
    text-align: center;

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #035aff;
    }
}

.box {
    .null-data {
        text-align: center;
        padding: 150px 0;
        img {
            width: 560px;
        }
        p {
            text-align: center;
            font-size: 14px;
            color: #999;
        }
    }
    padding: 15px;

    .header {
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;

            .item {
                cursor: pointer;
                width: 90px;
                height: 30px;
                background: #f2f3f7;
                border-radius: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
            }

            .active {
                color: #3867f5;
            }
        }

        .right {
        }
    }

    .addBox {
        overflow: hidden;
        width: 100%;

        .item-wrap {
            display: flex;
            align-items: center;
            margin-top: 15px;
            font-size: 14px;
            color: #303133;

            em {
                color: #f64646;
            }

            p:first-child {
                width: 104px;
                height: 30px;
                line-height: 30px;
                // text-align: justify;
                color: #303133;
                font-size: 14px;
            }

            p:first-child:after {
                content: '';
                display: inline-block;
                width: 100%;
            }

            .class-type {
                cursor: pointer;

                .act {
                    border: solid 3px #5b8cff;
                    border-radius: 8px;
                }

                img {
                    width: 286px;
                    height: 159px;
                    border: solid 3px #fff;
                }

                p {
                    margin-top: 7px;
                    text-align: center;
                    font-size: 14px;
                    color: #606266;
                }
            }
        }
    }

    .content {
        .item {
            .btnbox {
                display: flex;
                flex-direction: column;
                // justify-content: space-around;
                align-items: center;
            }

            cursor: pointer;
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            border-radius: 8px;
            transition: all 0.4s;
            background: #fff;
        }

        .left {
            position: relative;
            display: flex;

            .img-wrap {
                display: flex;
                // transform: scale(0.95);
                // padding: 2px 8px;
                border-radius: 8px;
                transition: all 0.2s;

                img {
                    width: 180px;
                    height: 100px;
                    border-radius: 8px;
                }
            }

            .right {
                width: 450px;
                margin-left: 10px;
                padding: 2px 0px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                    max-width: 300px;
                    line-height: 26px;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: -o-ellipsis-lastline;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .resources {
                    height: 18px;
                    width: 90px;
                    margin-left: 10px;
                    padding: 3px 5px;
                    color: #3060f6;
                    font-size: 14px;
                    border-radius: 5px;
                    border: 1px solid #3060f6;
                    text-align: center;
                }
                .main {
                    span {
                        width: 100%;
                        display: inline-block;
                    }

                    display: flex;
                    flex-direction: column;
                }
            }

            .tag-list {
                display: flex;
                position: absolute;
                top: 0;
                left: 0;
                flex-wrap: wrap; // 换行

                li {
                    min-width: 36px;
                    height: 14px;
                    margin-bottom: 5px;
                    margin-right: 6px;
                    padding: 5px 8px;
                    border-radius: 8px 0px 8px 0px;
                    box-shadow: 0px 2px 3px 0px rgba(255, 151, 39, 0.5);
                    text-align: center;
                    font-size: 12px;
                    background: linear-gradient(88deg, #f8be56 0%, #fa8846 100%);
                    color: #fff;
                }
            }

            .layout-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                border-bottom: solid 1px #f1f2f4;
                height: 40px;
                font-size: 12px;
                padding: 0 10px;

                .name {
                    overflow: hidden;
                    // max-width: 190px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333333;
                }

                i {
                    margin-right: 5px;
                    font-size: 14px;
                    vertical-align: top;
                }
            }

            .video-btn {
                display: none;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                line-height: 40px;
                text-align: center;
                color: #fff;
                background: #035aff;
            }

            .video-status {
                position: absolute;
                top: 0;
                left: 0;
                width: 84px;
                line-height: 23px;
                text-align: center;
                font-size: 12px;
                color: #fff;
                border-radius: 5px 0 5px 0;

                i {
                    margin-right: 2px;
                    font-size: 16px;
                    vertical-align: middle;
                }
            }

            .status0 {
                background: rgb(255, 65, 123);
            }

            .status1 {
                background: rgb(48, 96, 246);
            }

            .status2 {
                background: rgb(110, 123, 136);
            }

            .time {
                position: absolute;
                right: 8px;
                bottom: 96px;
                padding: 3px 6px;
                border-radius: 10px;
                font-size: 12px;
                background: rgba(0, 0, 0, 0.4);
                color: #fff;
            }
        }

        // .item:hover{
        // 	box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
        // }
        // .item:hover .video-status{
        // 	// width: 248px;
        // }
        // .item:hover img{
        // 	transform: scale(1.12);
        // }
        // .item:hover .img-wrap {
        // 	transform: scale(0.95);
        // 	// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
        // }
        // .item:hover .video-btn{
        // 	display: block;
        // }
        .playAnimation {
            display: inline-block;
            width: 24px;
            height: 20px;
            vertical-align: bottom;
            margin-right: 4px;

            .animationli {
                display: inline-block;
                width: 4px;
                height: 0px;
                background: #fff;
                margin-right: 2px;
                vertical-align: baseline;
                border-radius: 2px 2px 0 0;
            }

            .animationli:first-child {
                animation: mymove 0.9s infinite;
                -webkit-animation: mymove 0.9s infinite;
            }

            .animationli:nth-child(2) {
                animation: mymove 1.6s infinite;
                -webkit-animation: mymove 1.6s infinite;
            }

            .animationli:nth-child(3) {
                animation: mymove 1.3s infinite;
                -webkit-animation: mymove 1.3s infinite;
            }

            .animationli:nth-child(4) {
                animation: mymove 0.8s infinite;
                -webkit-animation: mymove 0.8s infinite;
            }

            @keyframes mymove {
                0% {
                    height: 6px;
                }

                35% {
                    height: 13px;
                }

                45% {
                    height: 14px;
                }

                55% {
                    height: 15px;
                }

                65% {
                    height: 11px;
                }

                75% {
                    height: 10px;
                }

                85% {
                    height: 8px;
                }

                100% {
                    height: 4px;
                }
            }

            @-webkit-keyframes mymove

      /* Safari and Chrome */ {
                0% {
                    height: 6px;
                }

                35% {
                    height: 13px;
                }

                45% {
                    height: 14px;
                }

                55% {
                    height: 15px;
                }

                65% {
                    height: 11px;
                }

                75% {
                    height: 10px;
                }

                85% {
                    height: 8px;
                }

                100% {
                    height: 4px;
                }
            }
        }
    }
}

.err-notice {
    margin-left: 20px;
    color: #b3b6ba;
    font-size: 12px;
    width: 300px;

    &.err-color {
        color: #f64646;
    }
}

::v-deep .el-upload-dragger {
    width: 280px;
    height: 130px;
}

::v-deep .el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}

::v-deep .upload-demo .el-upload-list {
    margin: -145px 0 0 15px !important;
    width: 250px;
    height: 110px;
}

::v-deep .el-divider--horizontal {
    margin: 24px 0 0 0;
}

textarea {
    height: 60px;
    width: 280px;
    border: solid #dcdfe6 1px;
    resize: none;
}

.width-2 {
    width: 408px;
}

.edufile .el-upload-list {
    margin: 0 !important;
}

.edufile .el-upload-list__item-name {
    padding: 0 !important;
    overflow: hidden;
    width: 240px;
    text-overflow: ellipsis;
}

.edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}

.upload-demo {
    height: 160px;
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
.evaluation-title {
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
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
.itemType {
    display: inline-block;
}
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
#vp {
    display: none;
}
.elTag {
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.garyBtn {
    background: #f1f2f4;
}
::v-deep .el-upload-list__item-name {
    max-width: 610px;
}
::v-deep .el-radio {
    margin-right: 20px;
}
.aiType_style {
    width: 560px;
}
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
    ::v-deep .el-dialog__title {
        padding-left: 20px;
    }
    ::v-deep .el-dialog__body {
        padding-top: 30px !important;
    }
}
.color {
    color: #b3b6ba;
}

.elTag {
    .el-tag {
        margin-right: 20px !important;
    }
}

.video-name {
    cursor: pointer;
    color: #409eff;
}

::v-deep .el-dialog__wrapper {
    left: 100px;
}

::v-deep .el-dialog__body {
    padding-top: 0 !important;
}

.notes {
    width: 500px;
    margin-left: 106px;
    margin-top: 10px;
    font-size: 12px;
    color: grey;
}

.el-upload-tip {
    font-size: 12px;
    color: gray;
    margin-top: 10px;
    width: 300px;
}
</style>

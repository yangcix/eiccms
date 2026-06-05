<template>
    <div class="content-main-wrap">
        <p class="content-title">AI磨课管理</p>

        <div class="main-wrap">
            <div class="search-operat" style="min-width: 1650px">
                <div>
                    <el-input
                        class="width-3"
                        clearable
                        v-model="searchKey"
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
                    <span class="search-desc">录制状态：</span>
                    <el-select
                        v-model="searchTypeList"
                        placeholder="录制状态"
                        class="width-3"
                        style="width: 110px"
                        clearable
                    >
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="search-desc">分析状态：</span>
                    <el-select
                        v-model="searchAiStatusList"
                        placeholder="分析状态"
                        class="width-3"
                        style="width: 110px"
                        clearable
                    >
                        <el-option
                            v-for="item in aiStatusList"
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
                    <el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
                </div>
                <div>
                    <el-button icon="el-icon-plus" v-if="permission.save" @click="add()">新增</el-button>
                    <el-button icon="el-icon-upload2" v-if="permission.save" @click="showExportDialog()"
                        >导出</el-button
                    >
                </div>
            </div>
            <div class="data-table table-border" style="min-width: 1650px">
                <el-table
                    :row-style="{height: '10px'}"
                    :cell-style="{padding: '12px 0'}"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column align="center" label="课程名称">
                        <template slot-scope="scope">
                            <div class="tableName" @click="detail(scope.row)">{{ scope.row.name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="subjectName" align="center" label="学科" width="100"> </el-table-column>
                    <el-table-column prop="teacherName" align="center" label="教师" width="100"> </el-table-column>
                    <el-table-column prop="grindingGradeName" align="center" label="年级" width="100"></el-table-column>
                    <!-- 全部数据或者市级/区县的下级数据 -->
                    <el-table-column
                        v-if="curShowType == 1 || ((curOrgLevel == 2 || curOrgLevel == 3) && curShowType == 3)"
                        prop="schoolName"
                        align="center"
                        label="学校"
                    >
                    </el-table-column>
                    <!-- 全部数据或者市级的下级数据 -->
                    <el-table-column
                        v-if="curShowType == 1 || (curOrgLevel == 2 && curShowType == 3)"
                        prop="districtName"
                        align="center"
                        label="区县"
                    >
                    </el-table-column>
                    <el-table-column align="center" label="录制状态" width="100">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.type === -1">待提交</li>
                                <li v-else-if="scope.row.type === 0">未开始</li>
                                <li v-else-if="scope.row.type === 1">录制中</li>
                                <li v-else-if="scope.row.type === 2">录制完成</li>
                                <li v-else-if="scope.row.type === 3">录制失败</li>
                                <li v-else>-</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分析状态" width="100">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.aiStatus === -1">
                                    排队中<el-tooltip
                                        :content="scope.row.msg"
                                        placement="top-start"
                                        v-if="scope.row.msg"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </li>
                                <li v-else-if="scope.row.aiStatus === 1">分析中</li>
                                <li v-else-if="scope.row.aiStatus === 2">分析成功</li>
                                <li v-else-if="scope.row.aiStatus === 3">
                                    分析失败<el-tooltip
                                        :content="scope.row.msg"
                                        placement="top-start"
                                        v-if="scope.row.msg"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </li>
                                <li v-else>-</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="资源来源" width="120">
                        <template slot-scope="scope">
                            <ul>
                                <li v-if="scope.row.resources === 1">排课录制</li>
                                <li v-if="scope.row.resources === 2">本地上传</li>
                                <li v-if="scope.row.resources === 3">智课终端</li>
                                <li v-if="scope.row.resources === 4">历史录制资源</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" align="center" width="160" label="添加时间"> </el-table-column>
                    <el-table-column align="center" min-width="140px" label="操作">
                        <template slot-scope="scope">
                            <div class="btnList">
                                <!-- 待提交、未开始、录制失败、分析失败且资源来源不是排课录制或智课终端 -->
                                <el-button
                                    v-if="
                                        permission.update &&
                                        (scope.row.type == -1 ||
                                            scope.row.type == 0 ||
                                            scope.row.type == 3 ||
                                            (scope.row.aiStatus == 3 &&
                                                (scope.row.resources !== 1 || scope.row.resources !== 3)))
                                    "
                                    type="text"
                                    @click="add(0, scope.row)"
                                    >编辑</el-button
                                >
                                <!-- 录制完成且分析成功 -->
                                <el-button
                                    type="text"
                                    @click="openDialog(scope.row)"
                                    v-if="permission.report && scope.row.type == 2 && scope.row.aiStatus == 2"
                                    >查看报告</el-button
                                >
                                <el-button
                                    v-if="permission.report && scope.row.type == 2 && scope.row.aiStatus == 2"
                                    type="text"
                                    @click="openReport(scope.row)"
                                    >课堂复盘</el-button
                                >
                                <!-- 基于不是待提交的状态下，录制中、排队中、分析失败、录制完成 -->
                                <el-button
                                    v-if="
                                        permission.watchVideo &&
                                        scope.row.type !== -1 &&
                                        (scope.row.type == 1 ||
                                            scope.row.aiStatus == -1 ||
                                            scope.row.aiStatus == 3 ||
                                            scope.row.type == 2)
                                    "
                                    type="text"
                                    @click="watchVideo(scope.row)"
                                    >观看视频</el-button
                                >
                                <!-- 分析失败且排课录制或者智课终端 -->
                                <el-button
                                    v-if="
                                        permission.report &&
                                        scope.row.aiStatus == 3 &&
                                        (scope.row.resources == 1 || scope.row.resources == 3)
                                    "
                                    type="text"
                                    @click="resetting(scope.row)"
                                    >重置分析</el-button
                                >
                                <!-- 待提交、未开始、录制失败、分析失败且资源来源不是排课录制或智课终端 -->
                                <el-button
                                    v-if="
                                        permission.delete &&
                                        (scope.row.type == -1 ||
                                            scope.row.type == 0 ||
                                            scope.row.type == 3 ||
                                            (scope.row.aiStatus == 3 &&
                                                (scope.row.resources !== 1 || scope.row.resources !== 3)))
                                    "
                                    type="text"
                                    style="color: #f56c6c"
                                    @click="deleteData(scope.row)"
                                    >删除</el-button
                                >
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-page">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :page-count="pages"
                    :current-page="pageNum"
                >
                </el-pagination>
            </div>
            <el-dialog
                :title="patchData.name + (patchData.type == 1 ? '(磨课中)' : '(已结束)')"
                :close-on-click-modal="false"
                :visible.sync="alertVideo"
                width="600px"
                class="videoBox"
                :before-close="handleClose"
            >
                <div id="videoAlert" ref="videoAlert"></div>
            </el-dialog>

            <el-dialog
                title="导出视频"
                :close-on-click-modal="false"
                :visible.sync="exportVideo"
                width="460px"
                :before-close="handleCloseExport"
            >
                <div>
                    <div class="dialog-item">
                        <p>名称</p>
                        <p><em>*</em>：</p>
                        <el-input v-model.trim="exportName" clearable class="width-5"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>视频分类</p>
                        <p><em>*</em>：</p>
                        <el-select
                            class="width-5"
                            style="margin-left: 2px"
                            @change="handleTheme"
                            v-model="themeValue"
                            placeholder="请选择"
                        >
                            <el-option v-for="item in themeData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="sublevel" v-if="themeTypeList.length > 0">
                        <div
                            v-for="(nape, index) in themeTypeList"
                            :key="index"
                            style="float: left; margin-left: 18px; margin-bottom: 20px"
                        >
                            <el-select
                                class="width-9"
                                clearable
                                v-model="nape.value"
                                :placeholder="`请选择${nape.name}`"
                                v-if="nape.children"
                            >
                                <el-option
                                    v-for="item in nape.children"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="dialog-item">
                        <p>观看权限</p>
                        <p><em>*</em>：</p>
                        <el-select class="width-5" v-model="userWatch" clearable placeholder="请选择" filterable>
                            <el-option v-for="item in userData" :key="item.id" :label="item.groupName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="dialog-item">
                        <p>封面</p>
                        <p><em style="opacity: 0">*</em>：</p>
                        <el-upload
                            class="upload-democlip"
                            accept=".png,.jpg"
                            :limit="1"
                            :on-exceed="handleOnExceed"
                            :file-list="fileList"
                            :action="uploadUrl"
                            :on-change="handleSelectFile"
                            :before-remove="beforeRemov1e"
                            list-type="picture"
                            :auto-upload="false"
                            drag
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </div>

                    <div class="dialog-item">
                        <p>公网点播</p>
                        <p><em>*</em>：</p>
                        <el-switch :active-value="1" :inactive-value="0" v-model="publicVod"> </el-switch>
                        <!-- <p class="err-notice">注：公网直播需保证智教慧学灵枢云账号中有足够的流量，否则可能影响直播</p> -->
                    </div>

                    <div class="dialog-item" v-if="publicVod === 1">
                        <p class="notselect">公网观看权限</p>
                        <p class="notselect"><em>*</em>：</p>
                        <el-radio v-model="watchType" :label="0">所有人可看</el-radio>
                        <el-radio v-model="watchType" :label="1">授权码观看</el-radio>
                    </div>

                    <div class="dialog-item" v-if="publicVod === 1 && watchType === 1">
                        <p>公网观看密码</p>
                        <p><em>*</em>：</p>
                        <el-input
                            class="width-2"
                            placeholder="4-20数字字母组成"
                            v-model.trim="watchPassword"
                            clearable
                            show-password
                        ></el-input>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleEnsure">确 定</el-button>
                    <el-button @click="handleCloseExport">取 消</el-button>
                </span>
            </el-dialog>
            <el-dialog title="删除磨课" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认删除该磨课？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="handleDelete()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="再次提交" :close-on-click-modal="false" :visible.sync="againShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">是否发起再次提交？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="handleAgain()">确 定</el-button>
                        <el-button @click="againShow = false">取 消</el-button>
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
            <!--  查看AI报告   -->
            <el-dialog
                title="查看报告"
                :close-on-click-modal="false"
                :visible.sync="reportShow"
                @close="closeReport"
                width="500px"
            >
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        margin-top: 30px;
                    "
                >
                    <span style="width: 300px">教师版</span>
                    <el-button v-if="reportAiStatus == 2" type="text" @click="openAiReportNew(reportRow, 0)"
                        >查看</el-button
                    >
                    <el-button v-if="reportAiStatus == 2" type="text" @click="openAiReportNew(reportRow, 1)"
                        >下载</el-button
                    >
                    <span v-if="reportAiStatus != 2" style="width: 180px">无报告，请联系管理员</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px">
                    <span style="width: 300px">专业版</span>
                    <el-button
                        v-if="reportData.professionalReport !== null && reportData.professionalReport !== ''"
                        type="text"
                        @click="downloadPDFReport(1)"
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
                        v-if="reportData.bctiReport !== null && reportData.bctiReport !== ''"
                        type="text"
                        @click="openBigDataReportNew(2, reportData.commentId)"
                        >查看</el-button
                    >
                    <el-button
                        v-if="reportData.bctiReport !== null && reportData.bctiReport !== ''"
                        type="text"
                        @click="openBigDataReportNew(1, reportData.commentId)"
                        >下载</el-button
                    >
                    <span v-else style="width: 180px">无报告，请联系管理员</span>
                </div>
                <div style="padding: 0 20px">
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
                            reportData.teachingSuggestionReport !== null && reportData.teachingSuggestionReport !== ''
                        "
                        type="text"
                        @click="downloadPDFReport(4)"
                        >下载</el-button
                    >
                    <span v-else style="width: 94px">
                        <span v-if="rowData.aiParsingStatus == 0">请求中...</span>
                        <span v-if="rowData.aiParsingStatus == 1">生成中...</span>
                        <el-button
                            v-if="rowData.aiParsingStatus == 3"
                            type="text"
                            :disabled="rebuildDisabled"
                            @click="rebuildTeachingSuggestionReport(reportRow)"
                            >重新生成</el-button
                        >
                    </span>
                </div>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="openAiReportDialog" width="30%" :before-close="handleClose">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="资料补充"
                :visible.sync="settingSubjectShow"
                width="26%"
                :before-close="handleSubjectClose"
            >
                <span class="search-desc"><span style="color: red">*</span>学科：</span>
                <!-- <span class="search-desc">直播：</span> -->
                <el-select v-model="subjectId" placeholder="请选择" style="margin-left: 10px; width: 300px">
                    <el-option v-for="item in setSubjectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                    <!--              <el-button @click="dialogVisible = false">取 消</el-button>-->
                    <el-button type="primary" style="width: 150px" @click="updateSubjectId">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="磨课数据导出"
                :close-on-click-modal="false"
                :visible.sync="isShowDataExport"
                width="600px"
                class="videoBox"
                :before-close="handleCloseExportDialog"
            >
                <div class="dialog-content">
                    <div class="dialog-item">
                        <p>数据量：</p>
                        <p>{{ exportDataNum }}</p>
                    </div>
                    <div class="dialog-item">
                        <p>时间区间：</p>
                        <el-date-picker
                            v-model="exportData.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeExportFilter"
                            value-format="yyyy-MM-dd"
                            class="width-5"
                        >
                        </el-date-picker>
                    </div>
                    <div class="dialog-item">
                        <p>学校：</p>
                        <el-cascader
                            v-model="exportData.orgIdList"
                            :props="cascaderProps"
                            :options="departmentTree"
                            @change="changeExportFilter"
                            collapse-tags
                            clearable
                            filterable
                            class="width-5"
                            @visible-change="getDepartmentList"
                            :show-all-levels="false"
                            multiple
                        ></el-cascader>
                    </div>
                    <div class="dialog-item">
                        <p>学科：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="exportData.subjectIdList"
                            placeholder="请选择学科"
                            class="width-5"
                            filterable
                            @change="changeExportFilter"
                            multiple
                            collapse-tags
                        >
                            <el-option
                                v-for="item in dialogSubjectList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>年级：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="exportData.gradeNameList"
                            placeholder="请选择年级"
                            class="width-5"
                            filterable
                            @change="changeExportFilter"
                            multiple
                            collapse-tags
                        >
                            <el-option
                                v-for="item in gradeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>教师：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="exportData.teacherIdList"
                            placeholder="请选择教师"
                            class="width-5"
                            filterable
                            @change="changeExportFilter"
                            multiple
                            remote
                            clearable
                            :remote-method="getTeacherList"
                            @clear="getTeacherList"
                        >
                            <el-option
                                v-for="item in teacherList"
                                :key="item.userId"
                                :label="item.name + (item.schoolName ? '-' + item.schoolName : '') + '-' + item.code"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>录制状态：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="exportData.typeList"
                            placeholder="请选择状态"
                            class="width-5"
                            filterable
                            @change="changeExportFilter"
                            multiple
                            collapse-tags
                        >
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>分析状态：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="exportData.aiStatusList"
                            placeholder="请选择状态"
                            class="width-5"
                            filterable
                            @change="changeExportFilter"
                            multiple
                            collapse-tags
                        >
                            <el-option
                                v-for="item in aiStatusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleExportData">确 定</el-button>
                    <el-button @click="handleCloseExportDialog">取 消</el-button>
                </span>
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
import {baseUrl, session} from '@/assets/js/utils';
import Player from 'xgplayer';
import FlvJsPlayer from 'xgplayer-flv.js';
import {creatTree} from '../../../assets/js/utils';
import {DICT} from '@/utils/dict.js';
export default {
    name: '',
    data() {
        return {
            aiNum: 0,
            searchResourcesStatus: '',
            resourcesList:
                JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2
                    ? [
                          {value: '', label: '全部'},
                          {value: 1, label: '排课录制'},
                          {value: 2, label: '本地上传'},
                          {value: 3, label: '智课终端'},
                          {value: 4, label: '历史录制资源'},
                      ]
                    : [
                          {value: '', label: '全部'},
                          {value: 1, label: '排课录制'},
                          {value: 2, label: '本地上传'},
                      ],
            typeList: DICT.RECORD_STATUS,
            searchLiveStatus: '',
            searchTypeList: '',
            searchAiStatusList: '',
            aiStatusList: DICT.ANALYSIS_STATUS,
            deleteVal: {},
            themeTypeList: [],
            themeData: [
                {
                    id: 8,
                    name: '教师研修',
                },
                {
                    id: 4,
                    name: '优质资源',
                },
                {
                    id: 6,
                    name: '课外知识',
                },
            ],
            themeValue: '',
            deleteShow: false,
            resettingShow: false,
            resettingVal: {},
            againVal: {},
            againShow: false,
            fileList: [],
            uploadUrl: baseUrl + '/sm/category/save',
            exportVideo: false,
            searchKey: '',
            pages: 1,
            pageNum: 1,
            tableData: [],
            alertVideo: false,
            myVideo: null,
            patchData: {},
            permission: '',
            loading: false,
            userData: [],
            userWatch: '',
            addEditInfo: {name: ''},
            exportName: '',
            deriveData: [],
            totalS: '',
            subjectList: [],
            publicVod: '', //是否公网点播
            watchType: 0, // 是否需要授权码
            watchPassword: '', // 观看密码
            checkItem: null,
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            openAiReportDialog: false,
            reportShow: false,
            reportData: {},
            reportAiStatus: 0,
            reportRow: {},
            // 设置学科窗口
            settingSubjectShow: false,
            subjectId: '',
            setSubjectList: [],
            rowData: {},
            rebuildDisabled: false,
            searchTeacher: '',
            departmentTree: [],
            cascaderProps: {
                value: 'id',
                label: 'name',
                multiple: true,
            },
            orgIdList: [],
            searchSchoolList: [],
            isFirstTime: true,
            curShowType: 1,
            curOrgType: 1,
            curOrgLevel: 2,
            isShowDataExport: false,
            schoolOptions: [],
            subjectOptions: [],
            exportData: {},
            gradeOptions: [],
            teacherOptions: [],
            exportDataNum: 0,
            dialogSubjectList: [],
            teacherList: [],
            exportUrl: baseUrl + '/aiGrinding/exportGrinding',
            showChooseProjectTimes: false,
            useList: [],
        };
    },
    created() {},
    watch: {
        $route(to, from) {
            if (from.path == '/aiGrinding/detail' || to.path == '/aiGrinding') {
                // 从概览跳转过来的话，分页和过滤项重置
                if (!(from.path == '/sm/aiclassAddEdit' || from.path == '/aiGrinding/detail')) {
                    this.pageNum = 1;
                    this.searchKey = '';
                    this.searchTypeList = '';
                    this.searchAiStatusList = '';
                    this.searchLiveStatus = '';
                    this.searchResourcesStatus = '';
                    this.orgIdList = [];
                    this.searchSchoolList = [];
                }
                // 在当前节点下的操作，返回到节点主页时，过滤项和分页保持记忆
                this.handleGetData();
            } else if (from.path !== '/aiGrinding') {
                if (from.path == '/sm/aiclassAddEdit') {
                    if (from.query && from.query.themeid) {
                        this.handleGetData();
                    } else {
                        this.pageNum = 1;
                        this.handleGetData();
                    }
                }
                this.searchKey = '';
                this.searchTypeList = '';
                this.searchAiStatusList = '';
                this.searchLiveStatus = '';
                this.searchResourcesStatus = '';
                this.orgIdList = [];
                this.searchSchoolList = [];
            }
        },
    },
    mounted() {
        if (localStorage.getItem('uiType') == 2) {
            this.handleGetType();
        }
        this.getSubjectList();
        this.pageNum = 1;
        this.searchTypeList = '';
        this.searchAiStatusList = '';
        this.searchLiveStatus = '';
        this.searchResourcesStatus = '';
        this.orgIdList = [];
        this.searchSchoolList = [];
        this.handleGetData();
        this.$bus.off('getAiList', this.handleGetData);
        this.$bus.on('getAiList', this.handleGetData);
        // this.$bus.emit('getAiList');
        this.getSubjectId();
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log(userInfo);
            // 角色权限（1全部数据，2全校数据，3下级数据, 4个人数据）
            this.curShowType = userInfo.sysUserAuth[0].type;
            // 1：教育局 2：学校 3：部门
            this.curOrgType = userInfo.sysOrganization.orgType;
            // admin和super的orgLevel为空
            // 1：省 2：市 3：区县 4：学校
            this.curOrgLevel = userInfo.sysOrganization.orgLevel ? userInfo.sysOrganization.orgLevel : 2;
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        detail(val) {
            if (this.permission.info) {
                this.$router.push({
                    path: '/aiGrinding/detail',
                    query: {themeid: val.id, permission: JSON.stringify(this.permission)},
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        openReport(val) {
            if (val.resources == 3 && (val.url == null || val.url == '')) {
                this.$message('视频未上传，无法生成报告', 'error');
                return;
            }
            if (val.aiStatus == 0 || val.aiStatus == 1) {
                this.$message('课堂分析中，请稍后再试！', 'error');
                return;
            }
            if (val.aiStatus == 3) {
                this.$message('报告生成失败，请联系管理员！', 'error');
                return;
            }

            if (this.aiType == 2) {
                window.open('/aiReport?id=' + val.id, '_blank');
            } else {
                window.open(val.aiReport, '_blank');
            }
        },
        openAiReportNew(row, downloadReport) {
            if (!row.analysisId) {
                return;
            }
            let route = '/ai/teacherReport?analysisId=' + row.analysisId + '&analysisType=1';
            if (downloadReport === 1) {
                route += '&downloadReport=1';
            }
            window.open(route, '_blank');
            // this.$router.push("/ai/teacherReport");
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
                this.dialogSubjectList = res.data;
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
            // 取数组每项的最后一项，并转为数值类型
            this.orgIdList = valueArray.map((subArray) => parseInt(subArray.at(-1)));
        },

        // 系统学科列表
        getSystemSubjectList() {
            this.$axios.get('/sm/label/listSubject').then((res) => {
                this.setSubjectList = res.data;
            });
        },
        // 获取学科ID
        getSubjectId() {
            this.$axios.get('/gansu/getUserSubjectId').then((res) => {
                if (res.data == null) {
                    this.getSystemSubjectList();
                    this.settingSubjectShow = true;
                } else {
                    this.settingSubjectShow = false;
                }
            });
        },
        // 保存学科信息
        setSubjectConfirm() {
            this.$axios.post('/gansu/getUserSubjectId', this.setSubject).then((res) => {
                if (res.data == null) {
                    this.getSystemSubjectList();
                    this.settingSubjectShow = true;
                } else {
                    this.settingSubjectShow = false;
                }
            });
        },
        updateSubjectId() {
            if (this.subjectId == null || this.subjectId == '' || this.subjectId.length < 1) {
                this.$message('请先选择授课学科！', 'error');
                return;
            }
            let formData = new FormData();
            formData.set('subjectId', this.subjectId);
            this.$axios.post('/gansu/updateUserSubjectId', formData).then((res) => {
                if (res.code === 200) {
                    this.settingSubjectShow = false;
                    this.$message('保存成功！', 'success');
                }
            });
        },
        againData(row) {
            this.againVal = row;
            this.againShow = true;
        },
        //重置分析弹窗
        resetting(row) {
            this.resettingVal = JSON.parse(JSON.stringify(row));
            if (row.isResetting != 0) {
                return;
            }
            const powerResult = this.hasProjectTimes(row);
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
        deleteData(row) {
            this.deleteVal = row;
            this.deleteShow = true;
        },
        // 获取类型
        handleGetType() {
            this.$axios.get('/sm/category/listAll').then((res) => {
                if (res.code === 200) {
                    let arr = res.data.filter((el) => el.id !== 1);
                    this.themeData = arr;
                }
            });
        },
        handleGetData() {
            this.loading = true;
            this.$axios
                .post('/aiGrinding/list', {
                    subjectId: this.searchLiveStatus,
                    resources: this.searchResourcesStatus,
                    typeList: this.searchTypeList !== '' ? [this.searchTypeList] : [],
                    aiStatusList: this.searchAiStatusList !== '' ? [this.searchAiStatusList] : [],
                    orgIdList: this.orgIdList,
                    keyWord: this.searchKey,
                    pageNum: this.pageNum, // 页数
                    pageSize: 10, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.pageList;
                        this.pages = res.data.pages;
                        this.permission = this.creatPermit(res.data.permit);
                        this.loading = false;
                        this.totalS = res.data.total;
                    }
                });
        },
        // 视频分类change
        handleTheme() {
            this.getTypeList();
        },
        //获取类型
        getTypeList() {
            this.$axios
                .get('/sm/label/listByCategory', {
                    categoryId: this.themeValue,
                    type: 0,
                    // id: this.$route.query.themeid
                    // id: this.currentData.id
                })
                .then((res) => {
                    let treeList = creatTree(res.data);
                    let data = [];
                    treeList.forEach((val) => {
                        if (val.children) {
                            data.push(val);
                        }
                        // val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
                    });
                    this.themeTypeList = data;
                });
        },
        // 合并
        add(type, val) {
            if (type == 0) {
                this.$router.push({
                    path: '/sm/aiclassAddEdit',
                    query: {
                        themeid: val ? val.id : '',
                        teacherName: val ? val.teacherName : '',
                        // 只有分析失败才需要在编辑页显示错误提示
                        msg: val.aiStatus == 3 ? (val.msg ? val.msg : '') : '',
                    },
                });
            } else {
                this.$router.push('/sm/aiclassAddEdit');
            }
        },
        // 导出视频确定btn
        handleEnsure() {
            if (!this.exportName) {
                this.$message('名称不能为空！', 'error');
                return true;
            }
            if (this.exportName.length > 20) {
                this.$message('名称限制20个字符！', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('请选择类型', 'error');
                return true;
            }
            let ifResult = false;
            if (this.themeTypeList.length !== 0) {
                let ifType = this.themeTypeList.some((v, i) => {
                    if (v.value === null || v.value === '') {
                        this.$message(`${v.name}未选`, 'error');
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
            if (this.userWatch === '') {
                this.$message('请选择观看权限！', 'error');
                return true;
            }
            if (this.watchType === 1) {
                if (!this.watchPassword) {
                    this.$message('请设置公网观看密码', 'error');
                    return;
                }
                if (this.$verify.checkNumEn(this.watchPassword, 4, 20)) {
                    this.$message('公网观看密码须4-20位数字或字母或二者组成', 'error');
                    return;
                }
            }
            let typeIdList = [];
            this.themeTypeList.forEach((v) => {
                if (v.value !== null || v.value !== '') {
                    typeIdList.push(v.value);
                }
            });
            let formData = new FormData();
            formData.append('categoryId', this.themeValue);
            formData.append('labelIdList', typeIdList);
            formData.append('file', this.addEditInfo.file);
            formData.append('name', this.exportName);
            formData.append('id', this.deriveData.id);
            formData.append('groupId', this.userWatch);
            formData.append('publicVod', this.publicVod);
            formData.append('watchType', this.watchType);
            formData.append('watchPassword', this.watchPassword);
            this.$axios.post('/sm/clip/exportVideo', formData).then((res) => {
                if (res.code === 200) {
                    this.exportVideo = false;
                    this.exportName = '';
                    this.userWatch = '';
                    this.publicVod = 0;
                    this.watchType = 0;
                    this.addEditInfo = {name: ''};
                    this.fileList = [];
                    this.themeTypeList = [];
                    this.themeValue = '';
                    this.watchPassword = '';
                    this.$message(res.message, 'success');
                    this.pageNum = 1;
                    this.handleGetData();
                }
            });
        },
        openDialog(row) {
            if (row.aiStatus == 0 || row.aiStatus == 1) {
                this.$message('报告生成中，请稍后再试！', 'error');
                return;
            } else if (row.aiStatus == 2) {
                this.reportAiStatus = row.aiStatus;
                this.$axios.get('/aiGrinding/downloadReport', {id: row.id}).then((res) => {
                    console.log(res.data);
                    this.reportData = res.data;
                });
                this.reportRow = row;
                console.log('this.reportData.aiStatus: ', this.reportData.aiStatus);
                this.reportShow = true;
                this.rowData = row;
            }
        },
        hh(row) {
            this.$axios
                .get('/teachingSuggestionConfig/deepseek', {analysisId: row.analysisId, aiBusinessType: 'AI_GRINDING'})
                .then((res) => {
                    console.log(res.data);
                });
        },
        /* downloadPDFReport(val){
      console.log("downloadPDFReport reportRow.id: ",this.reportRow.id);
      this.$axios.get('/sm/comment/exportPDFReport', {id: this.reportRow.id, type: 0, form: val},'blob').then(res => {
        let url = window.URL.createObjectURL(new Blob([res]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = this.reportRow.name+'_'+(val == 1 ? '专业版' : val == 0 ? '教师版' : '大数据报告') +'.pdf';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });
    },*/
        downloadPDFReport(val) {
            console.log('downloadPDFReport reportRow.id: ', this.reportRow.id);
            this.$axios
                .get('/sm/comment/exportPDFReport', {id: this.reportRow.id, type: 0, form: val}, 'blob')
                .then((res) => {
                    let url = window.URL.createObjectURL(new Blob([res]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    if (val < 4) {
                        link.download =
                            this.reportRow.name +
                            '_' +
                            (val == 1 ? '专业版' : val == 0 ? '教师版' : '大数据报告') +
                            '.pdf';
                    } else if (val == 4) {
                        link.download = this.reportRow.name + '_AI教学建议书.pdf';
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
            this.$axios.post('/aiGrinding/rebuildTeachingSuggestionReport', {id: row.id}).then((res) => {
                if (res.code == 200) {
                }
            });
            this.rowData.aiParsingStatus = 1;
        },
        closeReport() {
            setTimeout(() => {
                this.$nextTick(() => {
                    this.handleGetData();
                });
            }, 500);
        },
        handleCloseExport() {
            this.exportVideo = false;
            this.exportName = '';
            this.userWatch = '';
            this.publicVod = 0;
            this.watchType = 0;
            this.addEditInfo = {name: ''};
            this.fileList = [];
            this.themeTypeList = [];
            this.themeValue = '';
            this.watchPassword = '';
        },
        beforeRemov1e() {
            this.addEditInfo.file = null;
        },
        handleSelectFile(file) {
            if (file.raw.size / 1024 > 500) {
                this.fileList = [];
                return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
            } else {
                this.addEditInfo.file = file.raw;
            }
        },
        // 观看权限数据拉去
        handleGetUserData() {
            this.$axios.get('/sm/theme/getSysGroup').then((res) => {
                this.userData = res.data;
            });
        },
        // 下载
        handleDownload(row) {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = row.url;
            link.setAttribute('download', row.name); // 下载的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        // 再次编辑
        handleAgain() {
            this.$axios.post('/sm/clip/resubmit', {id: this.againVal.id}).then((res) => {
                if (res.code === 200) {
                    this.againShow = false;
                    this.$message(res.message, 'success');
                    // this.pageNum = 1;
                    this.handleGetData();
                }
            });
        },
        // 导出视频
        handleExportVideo(row) {
            this.deriveData = row;
            this.handleGetUserData();
            this.exportVideo = true;
        },
        // 删除
        handleDelete() {
            let data = new FormData();
            data.append('id', this.deleteVal.id);
            this.$axios.post('/aiGrinding/delete', data).then((res) => {
                if (res.code === 200) {
                    this.deleteShow = false;
                    this.$message(res.data, 'success');
                    // this.pageNum = 1;
                    this.totalS = this.totalS - 1;
                    if (this.pageNum * 10 - this.totalS === 10) {
                        this.pageNum = this.pageNum - 1 || 1;
                    }
                    this.handleGetData();
                }
            });
        },
        // 搜索
        handleSearch() {
            this.scrollTo0();
            this.pageNum = 1;
            this.handleGetData();
        },
        // 观看视频 （resources：1 新建资源、2 本地上传、3 智课终端、4 录播视频 ）（type：0 未开始、1磨课中、2已完成）
        watchVideo(row) {
            if (row.resources == 3) {
                console.log(row.url, 111);
                if (row.url == null || row.url == '') {
                    this.$message('视频未上传，暂时无法观看', 'error');
                } else {
                    if (row.type == 0) {
                        return;
                    }
                    this.patchData = row;
                    this.alertVideo = true;
                    setTimeout(() => {
                        this.handelGetVideo(row);
                    }, 100);
                }
            } else {
                if (row.type === 0) {
                    return;
                }
                this.patchData = row;
                this.alertVideo = true;
                setTimeout(() => {
                    this.handelGetVideo(row);
                }, 100);
            }
        },
        handleClose() {
            // 销毁播放
            clearInterval(this.checkItem);
            if (this.myVideo && this.myVideo.destroy) {
                this.myVideo.destroy();
            } else {
                this.$refs.videoAlert.innerHTML = '';
            }
            this.alertVideo = false;
        },
        handleSubjectClose() {
            if (
                this.setSubject.subjectId == null ||
                this.setSubject.subjectId == '' ||
                this.setSubject.subjectId.length < 1
            ) {
                this.$message('请先选择授课学科！', 'error');
                return;
            }
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
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.handleGetData();
        },
        checkTime() {
            this.loading = true;
            this.$axios
                .post('/aiGrinding/list', {
                    resources: this.searchResourcesStatus,
                    subjectId: this.searchLiveStatus,
                    typeList: this.searchTypeList !== '' ? [this.searchTypeList] : [],
                    aiStatusList: this.searchAiStatusList !== '' ? [this.searchAiStatusList] : [],
                    orgIdList: this.orgIdList,
                    keyWord: this.searchKey,
                    pageNum: this.pageNum, // 页数
                    pageSize: 10, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.pageList;
                        this.pages = res.data.pages;
                        this.permission = this.creatPermit(res.data.permit);
                        this.loading = false;
                        this.totalS = res.data.total;
                        let val = this.tableData.find((el) => el.id == this.patchData.id);
                        this.patchData = val;
                        this.handelGetVideo(val);
                    }
                });
        },
        handelGetVideo(val) {
            if (this.myVideo) {
                this.myVideo = null;
            }
            if (this.checkItem !== null) {
                clearInterval(this.checkItem);
            }
            if (val.type === 1) {
                this.checkItem = setInterval(() => {
                    if (this.myVideo !== null && this.myVideo.mediainfo) {
                        console.log(this.myVideo.mediainfo);
                        if (this.myVideo.mediainfo.hasAudio === true) {
                            console.log('有音频', this.myVideo.mediainfo.hasAudio);
                        } else {
                            console.log('无音频', this.myVideo.mediainfo.hasAudio);
                            this.myVideo.destroy();
                            this.handelGetVideo(_this.patchData);
                        }
                    }
                }, 1000);
                this.myVideo = new FlvJsPlayer({
                    id: 'videoAlert',
                    url: val.url,
                    // hasVideo: true,
                    // hasAudio: true,
                    volume: 0.6,
                    autoplay: true,
                    videoInit: true,
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '网络异常！',
                    ignores: ['progress'],
                    isLive: true,
                    playsinline: true,
                    lang: 'zh-cn',
                    flvOptionalConfig: {
                        enableStashBuffer: true,
                        type: 'flv',
                    },
                });
                const _this = this;
                let video = document.getElementsByTagName('video')[0];
                video.addEventListener('loadedmetadata', function () {
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        console.log('HTTP FLV流有画面');
                    } else {
                        console.log('HTTP FLV流没有画面');
                        _this.myVideo.destroy();
                        _this.handelGetVideo(_this.patchData);
                    }
                });
                _this.myVideo.on('error', function () {
                    _this.myVideo.destroy();
                    clearInterval(_this.checkItem);
                    _this.checkTime();
                });
            } else if (val.type == 2) {
                if (val.url.substring(val.url.length - 3) == 'mp4') {
                    this.myVideo = new Player({
                        id: 'videoAlert',
                        url: val.url,
                        autoplay: true,
                        videoInit: true,
                        closeVideoClick: true,
                        closeVideoTouch: true,
                        errorTips: '暂无视频源',
                        lang: 'zh-cn',
                    });
                } else {
                    let videoEl = `<div class="videoEnd" -webkit><p>回放视频生成中</p></div>`;
                    document.querySelector('#videoAlert').innerHTML = videoEl;
                }
            }
        },
        //重置分析
        resetAnalysis() {
            let data = new FormData();
            data.append('id', this.resettingVal.id);
            data.append('aiProjectId', this.resettingVal.aiProjectId);
            this.$axios.post('/aiGrinding/resetAnalysis', data).then((res) => {
                if (res.code === 200) {
                    this.resettingShow = false;
                    this.showChooseProjectTimes = false;
                    this.$message(res.data, 'success');
                    this.handleGetData();
                }
            });
        },
        showExportDialog() {
            this.changeExportFilter();
            this.getGradeOptions();
            this.isShowDataExport = true;
        },
        //获取学校列表
        getSchoolOptions() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolOptions = res.data;
            });
        },
        getSubjectOptions() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectOptions = res.data;
            });
        },
        getGradeOptions() {
            this.$axios.get('/sm/label/listLabel', {parentId: 13}).then((res) => {
                this.gradeOptions = res.data;
            });
        },
        getTeacherOptions() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.teacherOptions = res.data;
            });
        },
        // 导出弹窗数据改变
        changeExportFilter() {
            let orgIdList = this.exportData.orgIdList
                ? this.exportData.orgIdList.map((subArray) => parseInt(subArray.at(-1)))
                : [];
            this.$axios
                .post('/aiGrinding/list', {
                    startDate: this.exportData.time ? this.exportData.time[0] : '',
                    endDate: this.exportData.time ? this.exportData.time[1] : '',
                    gradeNameList: this.exportData.gradeNameList,
                    orgIdList: orgIdList,
                    teacherIdList: this.exportData.teacherIdList,
                    subjectIdList: this.exportData.subjectIdList,
                    aiStatusList: this.exportData.aiStatusList,
                    typeList: this.exportData.typeList,
                    pageSize: -1, // 请求显示条数
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.exportDataNum = res.data.length;
                    }
                });
        },
        handleCloseExportDialog() {
            this.isShowDataExport = false;
            this.exportData = {};
        },
        handleExportData() {
            let params = JSON.parse(JSON.stringify(this.exportData));
            params['startTime'] = params.time ? params.time[0] : '';
            params['endTime'] = params.time ? params.time[1] : '';
            params['orgIdList'] = params.orgIdList ? params.orgIdList.map((subArray) => parseInt(subArray.at(-1))) : [];
            const now = this.$moment();
            params['subjectNameList'] = this.getLabelsByValues(
                this.dialogSubjectList,
                params.subjectIdList,
                'id',
                'name'
            );
            let fileName = '磨课数据_' + now.format('YYYY-MM-DD HHmmss');
            this.$comjs.exportTableData('/aiGrinding/exportGrinding', params, fileName);
        },
        getTeacherList(name) {
            // 如果没有关键字或者清空文本框，就不请求数据且清掉下拉缓存数据。数据过多，请求全部的话，会因为渲染导致页面卡顿
            if (!name) {
                this.teacherList = [];
                return;
            }
            this.$axios.post('/sm/interactive/getUserList', {nickName: name}).then((res) => {
                this.teacherList = res.data;
            });
        },
        /**
         * 根据值的数组，匹配出对应的文本数组
         * @param {Array} options - 选项列表 [{ value, label }, ...]
         * @param {Array} selectedValues - 选中的值数组，例如 [1, 2]
         * @returns {Array} 对应的 label 数组
         */
        getLabelsByValues(options, selectedValues, value, label) {
            if (!Array.isArray(options) || !Array.isArray(selectedValues)) {
                return [];
            }
            return options.filter((option) => selectedValues.includes(option[value])).map((option) => option[label]);
        },
        async openBigDataReportNew(downloadReport, id) {
            const res = await this.$axios.get('/aiGrinding/getDetail', {id: id});
            if (res.code == 200) {
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
        handleCloseResetAnalysis() {
            this.showChooseProjectTimes = false;
            this.aiNum = 0;
            this.useList = [];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.sublevel {
    padding-left: 84px;
    overflow: hidden;

    .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.tableName {
    color: #409eff;
    cursor: pointer;
}

#videoAlert {
    width: 100% !important;
}

.btnList {
    a {
        padding-right: 10px;
    }

    li {
        text-decoration: none;
    }
}

.dialog-item {
    display: flex;
    align-items: center;

    // margin-top: 25px;
    em {
        color: #f64646;
    }

    p:first-child {
        width: 84px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
}
.tips {
    background-color: #f9f9f9;
    color: #aaaaaa;
    padding: 10px 15px;
    margin-bottom: 20px;
}

::v-deep .el-upload-dragger {
    width: 320px;
    height: 133px;
}

::v-deep .upload-democlip .el-upload-list {
    margin: -145px 0 0 15px;
    width: 290px;
}

.upload-democlip .el-upload-list__item-status-label {
    display: block;
}

.upload-democlip {
    height: 140px;
}

.el-upload-dragger .el-icon-upload {
    margin: 30px 0 16px;
}

.videoBox {
    ::v-deep .el-dialog__body {
        padding: 0 20px 30px 20px;
    }
}

::v-deep .videoEnd {
    width: 560px;
    height: 337.5px;
    background: #000;

    p {
        color: white;
        text-align: center;
        line-height: 337.5px;
    }
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
}
.divider {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #ddd;
}
</style>
<style lang="scss">
.el-tooltip__popper.is-dark {
    max-width: 260px;
}
</style>

<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.evaluationid ? '编辑' : '新增'}听评课活动`"
            ></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="box">
                    <p style="font-weight: 600; margin-top: 50px; font-size: 14px; color: #435cf9; margin-bottom: 25px">
                        基础信息
                    </p>
                    <div
                        class="item-wrap"
                        v-if="
                            aiType == 2 && radio1 == 2 && feeModel == 1 && (!isEdit || (isEdit && isTranslationPending))
                        "
                    >
                        <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                        <p>{{ aiNum }}次</p>
                        <p class="err-notice"><em>*</em>数据在选择教师后显示！</p>
                    </div>
                    <div
                        class="item-wrap"
                        v-if="
                            aiType == 2 && radio1 == 2 && feeModel == 1 && (!isEdit || (isEdit && isTranslationPending))
                        "
                    >
                        <p>优先使用<em>*</em>：</p>
                        <el-select :popper-append-to-body="false" v-model="addEditInfo.aiProjectId" class="width-2">
                            <el-option
                                v-for="item in useList"
                                :key="item.allocationId"
                                :label="item.projectName + '-' + item.residueNum + '次'"
                                :value="item.allocationId"
                            >
                            </el-option>
                        </el-select>
                        <p class="err-notice"><em>*</em>数据在选择教师后显示！</p>
                    </div>
                    <div class="item-wrap">
                        <p>评课名称<em>*</em>：</p>
                        <el-input class="width-2" v-model.trim="addEditInfo.name" clearable></el-input>
                    </div>
                    <div class="item-wrap" v-if="aiStatus == 1 && radio1 == 2">
                        <p>课堂类型<em>*</em>：</p>
                        <el-radio-group v-model="addEditInfo.classTypeId">
                            <el-radio v-for="(item, index) in classTypeList" :label="item.id" :key="index">{{
                                item.name
                            }}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="item-wrap">
                        <div style="display: flex">
                            <p>评课分类<em>*</em>：</p>
                            <!-- <p style="padding-top:6px"><em>*</em>：</p> -->
                        </div>
                        <div>
                            <div class="itemType width-9" style="padding-left: 0">
                                <el-select
                                    :popper-append-to-body="false"
                                    @change="handleTheme"
                                    v-model="themeValue"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in themeData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="itemType width-9" v-for="(nape, index) in themeTypeList" :key="index">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="`请选择${nape.name}`"
                                    placement="top-start"
                                >
                                    <el-select
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
                        <p>评课开始时间<em>*</em>：</p>
                        <el-date-picker
                            v-model="addEditInfo.startTime"
                            type="datetime"
                            style="width: 280px"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                        >
                        </el-date-picker>
                        <!-- <p class="err-notice">注：开始时间需大于当前时间</p> -->
                    </div>

                    <div class="item-wrap">
                        <p>评课结束时间<em>*</em>：</p>
                        <el-date-picker
                            v-model="addEditInfo.endTime"
                            type="datetime"
                            style="width: 280px"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间"
                        >
                        </el-date-picker>
                        <!-- <p class="err-notice">注：大于开始时间</p> -->
                    </div>
                    <div class="item-wrap">
                        <p>授课教师<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.teacherId"
                            placeholder="请选择或搜索授课教师"
                            class="width-2"
                            filterable
                            clearable
                            remote
                            :remote-method="getTeacherList"
                            :loading="teacherSelectLoading"
                            @clear="getTeacherList"
                            @change="changeTeacher"
                        >
                            <el-option
                                v-for="item in judgedIdList"
                                :key="item.userId"
                                :label="item.name + '-' + item.code"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>评课班级<em>*</em>：</p>
                        <el-select
                            v-model="addEditInfo.orgId"
                            @change="shcoolChange"
                            placeholder="选择学校"
                            style="margin-right: 10px; width: 138px"
                            filterable
                        >
                            <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            @change="changeGrade()"
                            :popper-append-to-body="false"
                            v-model="addEditInfo.evaluationGrade"
                            placeholder="选择年级"
                            style="margin-right: 10px; width: 130px"
                            filterable
                        >
                            <el-option
                                v-for="item in gradeList"
                                :key="item.gradeId"
                                :label="item.name"
                                :value="item.gradeId"
                            >
                            </el-option>
                        </el-select>
                        <el-select
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
                        <p>评课教师组<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.groupId"
                            placeholder="请选择评课教师组"
                            class="width-2"
                            style="margin-right: 2px"
                            filterable
                        >
                            <el-option
                                v-for="item in groupList"
                                :key="item.id"
                                :label="item.groupName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>评课模板<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.templateList"
                            placeholder="请选择评课模板"
                            class="width-2"
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
            <p>评课类型<em>*</em>：</p>
            <el-radio-group v-model="radio1" @change="changeType()">
              <el-radio :label="1">人工评价</el-radio>
              <el-radio v-if="aiStatus == 1" :label="2">人工评价+AI评价</el-radio>
            </el-radio-group>
            <p v-if="aiStatus == 1" class="err-notice">注：AI评价需进行AI配置并上传课堂教案</p>
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
                            <el-button type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload-tip">只能上传后缀为docx教学相关文件，大小需小于50M</div>
                        </el-upload>
                    </div>
                    <div class="item-wrap upload-box">
                        <p>封面<em style="opacity: 0">*</em>：</p>
                        <div class="upload-wrap">
                            <el-upload
                                class="upload-demo"
                                :limit="1"
                                :on-exceed="handleOnExceed"
                                :action="uploadUrl"
                                accept=".png,.jpg"
                                :file-list="fileList"
                                :on-change="selectFile"
                                :on-remove="removeFile"
                                list-type="picture"
                                :auto-upload="false"
                                drag
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                                </div>
                                <div class="el-upload-tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </div>
                    </div>
                    <p style="font-weight: 600; margin-top: 5px; font-size: 14px; color: #435cf9; margin-bottom: 25px">
                        视频资源
                    </p>
                    <div class="item-wrap" v-show="!$route.query.evaluationid">
                        <p>资源来源<em>*</em>：</p>
                        <el-radio-group v-model="radio2" @change="getGradeLists()">
                            <el-radio :label="2">排课录制</el-radio>
                            <el-radio v-if="$route.query.type == 2" :label="3">本地上传</el-radio>
                            <el-radio v-if="$route.query.type == 2" :label="4">智课终端</el-radio>
                            <el-radio :label="1">站内资源</el-radio>
                            <el-radio v-if="$route.query.type == 2" :label="5">历史录制资源</el-radio>
                            <el-tooltip :content="tooltipContent" placement="right" effect="dark">
                                <i
                                    v-if="$route.query.type == 2"
                                    class="iconfont icon-wenhao"
                                    style="margin-left: -20px; color: rgb(121, 145, 255)"
                                ></i>
                            </el-tooltip>
                        </el-radio-group>
                    </div>
                    <p v-show="radio1 == 2 && !evaluationid" v-if="radio2 == 2 && !evaluationid" class="notes">
                        注：将自动录制开始时间到结束时间区间范围的视频进行AI分析，请合理安排好时间！
                    </p>
                    <p v-show="radio1 == 2 && !evaluationid" v-if="radio2 == 4 && !evaluationid" class="notes">
                        注：将<span style="color: red">手动</span
                        >录制开始时间到结束时间区间范围的视频进行AI分析，需小于60分钟，请合理安排好时间！
                    </p>
                    <div v-if="radio2 == 1" class="item-wrap">
                        <p>课堂视频<em>*</em>：</p>
                        <el-tag
                            class="elTag"
                            v-if="objectName"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseTag()"
                        >
                            {{ objectName }}
                        </el-tag>
                        <el-button type="primary" icon="el-icon-plus" @click="bindTheme">{{
                            addEditInfo.objectId ? '更改资源' : '选择资源'
                        }}</el-button>
                    </div>
                    <div v-else-if="radio2 == 2 || radio2 == 4">
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
                        <div class="item-wrap">
                            <p>课堂开始时间<em>*</em>：</p>
                            <el-date-picker
                                v-model="addEditInfo.liveStartTime"
                                type="datetime"
                                @change="clearTerminal"
                                style="width: 280px"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="开始时间"
                            >
                            </el-date-picker>
                            <p class="err-notice">
                                <em v-if="radio2 == 4">*</em
                                >{{
                                    radio2 == 4
                                        ? '需大于当前时间，该时间为预设时间，具体开始时间以实际开始录制时间为准'
                                        : '注：需大于当前时间'
                                }}
                            </p>
                        </div>

                        <div class="item-wrap">
                            <p>课堂时长<em>*</em>：</p>
                            <el-input
                                class="width-2"
                                v-model="addEditInfo.durationMinutes"
                                clearable
                                placeholder="请输入课堂时长"
                                @change="changeDurationMin"
                            ></el-input>
                            &nbsp;分钟
                            <p class="err-notice"><em>*</em>课堂时长最多60分钟</p>
                        </div>
                        <div v-if="radio2 == 2 || radio2 == 4" class="item-wrap">
                            <p>上课位置<em>*</em>：</p>
                            <el-select
                                v-model="addEditInfo.buildingId"
                                @change="buildChange"
                                placeholder="请选择教学楼"
                                style="margin-right: 10px; width: 130px"
                                filterable
                            >
                                <el-option
                                    v-for="item in buildlList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-model="addEditInfo.classroomId"
                                @change="classroomChange(1)"
                                placeholder="请选择教室"
                                style="width: 120px"
                                filterable
                            >
                                <el-option
                                    v-for="item in classroomList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div v-show="radio2 == 2" class="item-wrap">
                            <p>直播设备<em>*</em>：</p>
                            <el-select
                                v-model="addEditInfo.terminalIdList"
                                placeholder="请选择设备"
                                class="width-2"
                                filterable
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
                            <span v-if="terminalName !== ''" style="color: #999; font-size: 14px">{{
                                terminalName
                            }}</span>
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
                            <p v-if="aiType == 1" style="line-height: 40px; color: #303133; font-size: 14px">
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
                        <p style="font-size: 14px; color: red; margin-left: 108px; margin-top: 10px">
                            注：上传的视频资源要与页面填写信息一致，不然将会影响AI分析结果的准确性
                        </p>
                    </div>
                    <div v-else class="item-wrap">
                        <p>课堂视频<em>*</em>：</p>
                        <el-tag
                            class="elTag"
                            v-if="objectVideoName"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseVideo()"
                            >{{ objectVideoName }}</el-tag
                        >
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">{{
                            addEditInfo.recordId ? '更改资源' : '选择资源'
                        }}</el-button
                        ><br />
                    </div>
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
                    <el-button
                        v-if="permission.save && (!isEdit || (isEdit && isTranslationPending))"
                        class="edit-btn ml20"
                        @click="save"
                        >暂存</el-button
                    >
                    <el-button type="primary" v-if="permission.submit" class="edit-btn" @click="save(1)"
                        >保存并送审</el-button
                    >
                    <el-button type="primary" v-if="permission.fastRelease" class="edit-btn" @click="save(2)"
                        >一键发布</el-button
                    >
                </div>
            </div>
        </div>
        <el-dialog
            title="选择资源"
            :close-on-click-modal="false"
            :visible.sync="chooseCpm"
            width="40%"
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
                                                :disabled="
                                                    addEditInfo.objectId === scope.row.id &&
                                                    objectName === scope.row.name
                                                        ? true
                                                        : false
                                                "
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
                                @current-change="pageChange"
                                :current-page="pageNum"
                                :page-count="pages"
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
                            <el-table v-loading="loading" :data="videoList" style="width: 100%">
                                <el-table-column align="left" prop="name" label="视频名称" width="180">
                                </el-table-column>
                                <el-table-column align="center" prop="createUserName" label="作者" width="180">
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <div>
                                            <!-- {{ scope.row | filtersDisabled }} -->
                                            <el-link
                                                :disabled="
                                                    addEditInfo.objectId === scope.row.id &&
                                                    objectName === scope.row.name
                                                        ? true
                                                        : false
                                                "
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
        <el-dialog title="系统错误" :close-on-click-modal="false" :visible.sync="upErrorShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">{{ upErrorMsg }}</p>
            </div>
        </el-dialog>

        <el-dialog
            title="选择资源"
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
                            <el-table v-loading="loading" :data="videoListData" style="width: 100%">
                                <el-table-column align="left" prop="name" label="视频名称">
                                    <template slot-scope="scope">
                                        <el-tooltip
                                            v-if="scope.row.name.replace(/\s+/g, '').length > 20"
                                            :content="scope.row.name"
                                            placement="top"
                                        >
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
                                        </el-tooltip>
                                        <span v-else class="video-name" @click="play(scope.row.url)"
                                            ><i class="el-icon-video-play"></i> {{ scope.row.name }}</span
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" prop="teacherName" label="教师">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.teacherName ? scope.row.teacherName : '——' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" label="操作">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-link
                                                :disabled="scope.row.id === addEditInfo.recordId"
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
            :close-on-click-modal="false"
            :visible.sync="playVisible"
            :before-close="closePlay"
            width="fit-content"
            center
        >
            <div id="videoFilm" ref="videoFilm"></div>
        </el-dialog>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import Player from 'xgplayer';
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            upErrorMsg: '',
            upErrorShow: false,
            videoSizet: '',
            videoSizes: '',
            videoId: 1,
            teacherVideo: [],
            studentVideo: [],
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            classTypeList: [],
            videoData: [],
            aiStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
            feeModel: JSON.parse(localStorage.getItem('sysInfo')).type,
            gradeList: [],
            classList: [],
            edufileList: [],
            fileList: [],
            themeValue: '',
            themeTypeList: [],
            uploadUrl: baseUrl + '/sm/label/save',
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            schoolList: [], // 可选择的学校
            buildlList: [], // 可选的教学楼
            classroomList: [], // 可选的教室
            terminalIdList: [], //可选的 直播设备 数组
            teachingFileIds: [], // 一键发布时上传文件数组
            radio1: '',
            radio2: 2,
            addEditInfo: {
                classTypeId: '',
                name: '', // 评课
                teacherId: '', //授课教师id
                startTime: '',
                endTime: '',
                groupId: '', // 评课组id
                objectId: '', // 绑定主题id
                recordId: '', // 绑定的视频id
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
                recordingMethod: 0,
            },
            permission: [],
            aiNum: 0,
            objectName: '', // 绑定主题名称
            objectVideoName: '', // 绑定视频名称
            chooseCpm: false, // 主题绑定弹窗
            activeName: 'first', // tab切换
            liveKey: '', // 直播搜索关键词
            pageNum: 1,
            pages: 1,
            themeData: [],
            videoSeekT: '', // 视频搜索关键词
            pageNumT: 1,
            pagesT: 1,
            loadingW: false, // 直播表格加载动画
            loading: false, // 视频表格加载
            liveList: [], // 直播表格数据
            videoList: [], // 视频列表数据
            judgedIdList: [], // 评课教师数组
            groupList: [], // 评课组数组
            evaluationTemplateList: [], // 评课模板数组
            evaluationid: '', // 编辑评课id
            fromPath: '',
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
            teacherSelectLoading: false,
            recordingMethodList: [
                {name: '自动录制', id: 0},
                {name: '手动录制', id: 1},
            ],
            terminalName: '',
            useList: [],
            isEdit: false,
            isTranslationPending: false,
        };
    },
    components: {},
    computed: {
        ...mapState({
            aiUploadTable: 'aiUploadTable',
        }),
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.fromPath = from.path;
        });
    },
    mounted() {
        this.radio1 = this.$route.query.type;
        // this.getCategoryList();
        if (this.aiStatus == 1) {
            this.getClassTypeList();
        }
        this.getAuth();
        this.getgroupList();
        this.getTemplateList();
        this.getSchoolList(); //获取学校列表
        this.handleGetType();
        if (this.$route.query.mode) {
            this.radio2 = 4;
        }
        // 编辑
        if (this.$route.query.evaluationid) {
            this.evaluationid = this.$route.query.evaluationid;
            this.getCommentInfo(); //编辑获取主体信息
            if (this.$route.query.teacherName) {
                this.getTeacherList(this.$route.query.teacherName);
                this.getUseList();
            }
            this.isEdit = true;
        } else {
            if (JSON.parse(localStorage.getItem('userInfo')).roleType == 1) {
                this.getTeacherList(JSON.parse(localStorage.getItem('userInfo')).nickName);
                this.getUseList();
                this.addEditInfo.teacherId = JSON.parse(localStorage.getItem('userInfo')).userId;
            } else {
                this.addEditInfo.teacherId = '';
            }
        }
        if (this.aiType == 2 && this.aiStatus == 1 && this.$route.query.type == 2 && this.feeModel == 1) {
            console.log('按量分析获取AI分析剩余次数...');
            this.getCount();
        }
    },
    methods: {
        ...mapActions({
            commitAiUploadBoxVisible: 'commitAiUploadBoxVisible',
            commitAiUploadTable: 'commitAiUploadTable',
            commitAiUploadDataState: 'commitAiUploadDataState',
        }),
        getAuth() {
            this.$axios
                .post('/sm/comment/list', {
                    keyWord: '',
                    pageNum: 1,
                    pageSize: 10,
                })
                .then((res) => {
                    this.permission = this.creatPermit(res.data.permit);
                });
        },
        getCount() {
            this.$axios.get('/aiGrinding/getCount').then((res) => {
                if (res.code != 200) {
                    return;
                }
            });
        },
        getClassTypeList() {
            this.$axios.get('/aiGrinding/getClassType').then((res) => {
                this.classTypeList = res.data;
                this.addEditInfo.classTypeId = res.data[0].id;
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
            console.log('vp', vp);
            // canvas.style.display = 'none';
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
        clearTerminal() {
            this.calcEndTime();
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
            if (!this.addEditInfo.liveStartTime || !this.addEditInfo.durationMinutes) return;
            this.addEditInfo.liveEndTime = this.$comjs.addMinutesByTimestamp(
                this.addEditInfo.liveStartTime,
                this.addEditInfo.durationMinutes
            );
        },
        changeType() {
            this.addEditInfo.objectId = '';
            this.objectName = '';
        },
        getGradeLists() {
            this.getTeachBuildList(this.addEditInfo.orgId);
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        changeGrade() {
            this.addEditInfo.evaluationClass = '';
            this.getClassList();
        },
        changeClass() {},
        getCategoryList() {
            this.$axios.get('/aiGrinding/getGrade?type=2').then((res) => {
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
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        // 移除文件
        handleRemove(file, fileList) {
            console.log('file'.file, fileList);
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
                if (this.evaluationid) {
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
                    // // 不为编辑，// 删除调用删除接口
                    // let id = file.response.data.id
                    // this.deleteEduFile(id);
                }
                // }).catch(() => reject());
            }
        },
        // edu上传之前
        eduBeforeupload(file) {
            console.log(file.type, 'file', file.name.replace(/.+\./, ''));
            let isJpg;
            if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                // this.edufileList = [];
                // setTimeout(() => {
                //   this.edufileList = [];
                //   console.log(this.edufileList)
                // }, 2000);
                this.$message('上传失败，文件格式错误', 'error');
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
                // this.getTeacherList();
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
            this.addEditInfo.buildingId = '';
            this.addEditInfo.classroomId = '';
            this.addEditInfo.evaluationGrade = '';
            this.addEditInfo.evaluationClass = '';
            this.classroomList = [];
            this.terminalName = '';
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
            if (this.evaluationid) {
                data.themeId = this.evaluationid;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                this.terminalIdList = res.data;
                this.terminalName =
                    this.terminalIdList[0] && this.terminalIdList[0].terminalName
                        ? this.terminalIdList[0].terminalName
                        : '';
                if (!this.$route.query.evaluationid || room === 'room') {
                    // 新增
                    const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';
                    this.addEditInfo.terminalIdList = id ? id : '';
                }
            });
        },
        // 获取教师列表
        getTeacherList(name) {
            // 如果没有关键字或者清空文本框，就不请求数据且清掉下拉缓存数据。数据过多，请求全部的话，会因为渲染导致页面卡顿
            if (!name) {
                this.judgedIdList = [];
                this.$comjs.getUseList(this, null);
                return;
            }
            this.teacherSelectLoading = true;
            this.$axios.post('/sm/interactive/getUserList', {nickName: name}).then((res) => {
                this.judgedIdList = res.data;
                this.teacherSelectLoading = false;
            });
        },
        // 获取评课模板
        getTemplateList() {
            this.$axios.get('/sm/template/listAll').then((res) => {
                this.evaluationTemplateList = res.data;
            });
        },
        // 获取评课详情
        getCommentInfo() {
            this.$axios.get('/sm/comment/info', {id: this.evaluationid}).then((res) => {
                for (let key in this.addEditInfo) {
                    this.addEditInfo[key] = res.data[key];
                }
                this.radio1 = res.data.evaluationType;
                this.radio2 = res.data.resources;
                if (res.data.evaluationType == 2 && res.data.teachingFileList) {
                    this.edufileList = res.data.teachingFileList;
                    this.teachingFileIds = this.edufileList.map((i) => i.id);
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
                    this.addEditInfo.recordId = res.data?.smTheme?.id;
                    this.addEditInfo.objectId = res.data?.smTheme?.id;
                } else if (res.data.resources == 2 || res.data.resources == 4) {
                    if (res.data.resources == 2) {
                        this.addEditInfo.objectId = '';
                        this.addEditInfo.terminalIdList = res.data.terminalList[0].terminalId;
                    }
                    this.addEditInfo.liveStartTime = res.data.smTheme.startTime;
                    this.addEditInfo.liveEndTime = res.data.smTheme.endTime;
                    this.addEditInfo.buildingId = res.data.buildingId;
                    this.addEditInfo.classroomId = res.data.classroomId;
                    this.getTeachBuildList(res.data.evaluationOrgId);
                    this.getClassroomList(res.data.buildingId);
                    this.getTerminalIdList();
                    this.addEditInfo.durationMinutes = this.$comjs.createDuraTionMin(
                        this.addEditInfo.liveStartTime,
                        this.addEditInfo.liveEndTime
                    );
                } else if (res.data.resources == 3) {
                    this.addEditInfo.objectId = '';
                    this.teacherVideo = [{name: '', url: res.data.teacherVideoUrl}];
                    this.addEditInfo.teacherVideo = res.data.teacherVideoUrl;
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
                } else if (res.data.resources == 5) {
                    this.objectVideoName = res.data.objectName;
                    this.addEditInfo.recordId = res.data.objectId;
                    this.addEditInfo.objectId = res.data.objectId;
                }
                this.themeValue = parseInt(res.data.category); // 获取编辑id赋给一级分类select
                let arr = [];
                res.data.templatesList.forEach((el) => {
                    arr.push(el.id);
                });
                this.addEditInfo.templateList = arr;
                // this.getCategoryList();
                this.getGradeList(res.data.evaluationOrgId);
                if (res.data.evaluationGrade) {
                    this.getClassList();
                }
                if (this.themeValue !== '') {
                    // this.getTypeList();
                    this.themeTypeList = res.data.categoryList;
                    console.log(this.themeTypeList, 2121);
                    this.$forceUpdate();
                }
                if (this.addEditInfo.status == 1) {
                    this.isTranslationPending = true;
                }
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/sm/comment');
            } else {
                this.$router.go(-1);
            }
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
        handleTab() {
            if (this.activeName === 'first') {
                this.pageNum = 1;
                this.handleLive();
            } else {
                this.pageNumT = 1;
                this.handleVideo();
            }
        },
        // 直播查询
        searchLive() {
            this.pageNum = 1;
            this.handleLive();
        },
        // 视频查询
        handleSearchT() {
            this.pageNumT = 1;
            this.handleVideo();
        },
        // 选择主类并获取对应子类
        handleTheme() {
            this.getTypeList();
        },
        // 获取类型主类
        handleGetType() {
            this.$axios.get('/sm/category/listAll?type=2').then((res) => {
                if (res.code === 200) {
                    this.themeData = res.data;
                }
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
        // 直播列表数据
        handleLive() {
            this.loadingW = true;
            this.$axios
                .get('/sm/comment/listTheme', {
                    // commentGroup: this.addEditInfo.groupId,
                    id: this.$route.query.evaluationid ? this.$route.query.evaluationid : '',
                    keyWord: this.liveKey,
                    pageNum: this.pageNum,
                    pageSize: 8,
                    evaluationType: this.$route.query.type,
                })
                .then((res) => {
                    this.loadingW = false;
                    this.liveList = res.data.pageList;
                    this.pages = res.data.pages;
                });
        },
        // 视频列表数据
        handleVideo() {
            this.loadingW = true;
            this.$axios
                .get('/sm/comment/listFile', {
                    // commentGroup: this.addEditInfo.groupId,
                    id: this.$route.query.evaluationid ? this.$route.query.evaluationid : '',
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
        // 关闭绑定弹窗
        handleClose() {
            this.videoSeekT = '';
            this.liveKey = '';
            this.activeName = 'first';
            this.chooseCpm = false;
            this.pageNum = 1;
        },
        // 关闭绑定视频弹窗
        closeVideoShow() {
            this.videoName = '';
            this.videoActiveName = 'first';
            this.videoShow = false;
            this.pageNumber = 1;
        },
        // 显示绑定主题表格
        bindTheme() {
            this.pageNum = 1;
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
        handleCloseVideo() {
            this.addEditInfo.recordId = '';
            this.objectVideoName = '';
        },
        save(val) {
            console.log('保存听评课活动...');
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
                    let url = '/sm/comment/save';
                    let judgeData = {};
                    judgeData.name = this.addEditInfo.name;
                    if (this.evaluationid) {
                        judgeData.id = this.addEditInfo.id;
                    }
                    this.$axios.post('/sm/comment/check', judgeData).then((res) => {
                        if (res.code == 200) {
                            formData.append('name', this.addEditInfo.name);
                            formData.append('aiConfigId', this.aiType);
                            console.log(
                                '=============================aiStatus: ' + this.aiStatus + ', radio1: ' + this.radio1
                            );
                            if (this.aiStatus == 1 && this.radio1 == 2) {
                                formData.append('classTypeId', this.addEditInfo.classTypeId);
                                console.log(
                                    '=============================classTypeId: ' + this.addEditInfo.classTypeId
                                );
                            }
                            formData.append('category', this.themeValue);
                            formData.append('labelList', idList);
                            formData.append('startTime', this.addEditInfo.startTime);
                            formData.append('endTime', this.addEditInfo.endTime);
                            formData.append('teacherId', this.addEditInfo.teacherId);
                            formData.append('groupId', this.addEditInfo.groupId);
                            formData.append('templateList', this.addEditInfo.templateList);
                            formData.append('evaluationOrgId', this.addEditInfo.orgId);
                            formData.append(
                                'aiProjectId',
                                this.addEditInfo.aiProjectId ? this.addEditInfo.aiProjectId : null
                            );
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
                            } else if (this.radio2 === 3) {
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
                                formData.append('recordId', this.addEditInfo.recordId);
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
                            if (this.addEditInfo.file && this.addEditInfo.file.name) {
                                formData.append('file', this.addEditInfo.file ? this.addEditInfo.file : '');
                            } else {
                                formData.append('coverUrl', this.addEditInfo.file ? this.addEditInfo.file : '');
                            }
                            if (this.evaluationid) {
                                url = '/sm/comment/update';
                                formData.append('id', this.addEditInfo.id);
                                formData.append('status', val && val == 1 ? 2 : val == 2 ? 3 : 1);
                            } else {
                                formData.append('status', val && val == 1 ? 2 : val == 2 ? 3 : 1);
                            }
                            if (val == 2) {
                                url = '/sm/comment/fastRelease';
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
                                            id: this.evaluationid ? this.evaluationid : -1, // 视频id
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
                                            id: this.evaluationid ? this.evaluationid : -1, // 视频id
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
                                this.$router.push('/sm/comment');
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
                                            setTimeout(() => {
                                                console.log('this.addEditInfo', this.addEditInfo);
                                                if (this.addEditInfo.teacherVideo && this.radio2 == 3) {
                                                    this.commitAiUploadTable({
                                                        type: 'splice',
                                                        detail: formData, // 视频id
                                                    });
                                                } else {
                                                    this.$router.push('/sm/comment');
                                                }
                                                if (this.$route.path == '/sm/comment') {
                                                    this.$bus.emit('getComment');
                                                }
                                                this.evaluationid
                                                    ? this.$message('修改评课成功', 'success')
                                                    : this.$message('新增评课成功', 'success');
                                            }, 500);
                                        } else if (res.code == -3000) {
                                            this.upErrorMsg = res.message;
                                            this.upErrorShow = true;
                                        } else if (res.code == -10000) {
                                            // this.editShow = false;
                                            // // 判断编辑是否有替换视频
                                            // if (this.addEditInfo.video) {
                                            //   this.commitAiUploadDataState({
                                            //     uploadId: uploadId,
                                            //     status: 0,
                                            //   });
                                            // }
                                            if (this.addEditInfo.teacherVideo) {
                                                this.commitAiUploadTable({
                                                    type: 'splice',
                                                    detail: formData, // 视频id
                                                });
                                            }
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

                // this.$axios.post(url, formData).then((res) => {
                //   if (res.code == 200) {
                //     // this.goBack();
                //     this.$router.push("/sm/comment");
                //     this.evaluationid
                //       ? this.$message("修改评课成功", "success")
                //       : this.$message("新增评课成功", "success");
                //   }
                // });
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
            this.loading = true;
            this.$axios
                .get('/sm/record/listLessThanSixtyMinute', {
                    keyWord: this.videoName,
                    isAI: true,
                    pageNum: this.pageNumber,
                    pageSize: 10,
                })
                .then((res) => {
                    this.loading = false;
                    this.videoListData = res.data.pageList;
                    this.videoPermission = this.creatPermit(res.data.permit);
                    this.page = res.data.pages;
                    this.totalS = res.data.total;
                    this.pageNumber = res.data.pageNum;
                });
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
            console.log(minutes, 'time后台听评课');
            if (minutes > 60) {
                this.$message('视频时长不能超过60分钟', 'error');
                return;
            }
            this.addEditInfo.type = type;
            this.addEditInfo.recordId = row.id;
            this.objectVideoName = row.name;
            this.videoShow = false;
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
            if (this.$verify.chLetterNum(this.addEditInfo.name, 100)) {
                this.$message('课程名称由中文大小写字母数字组成，最长100位！', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('分类未选择', 'error');
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
            if (!this.addEditInfo.teacherId) {
                this.$message('授课教师不能为空', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
                this.$message('请选择学校', 'error');
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
                if (
                    // !this.addEditInfo.id &&
                    this.$verify.isEmpty(this.addEditInfo.teacherVideo)
                ) {
                    this.$message(this.aiType == 1 ? '请上传教师画面视频' : '请上传视频', 'error');
                    return true;
                }
                if (
                    // !this.addEditInfo.id &&
                    this.$verify.isEmpty(this.addEditInfo.studentVideo) &&
                    this.aiType == 1
                ) {
                    this.$message('请上传学生画面视频', 'error');
                    return true;
                }
            } else {
                if (this.$verify.isEmpty(this.addEditInfo.recordId)) {
                    this.$message('请选择课堂视频', 'error');
                    return true;
                }
            }
        },

        //分页点击
        pageChange(val) {
            this.pageNum = val;
            // this.pages = 1;
            this.handleLive();
        },
        pageChangeT(val) {
            this.pageNumT = val;
            // console.log(val);
            this.handleVideo();
        },
        getUseList() {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            let params = {};
            params['productType'] = 1;
            params['currentUserId'] = this.addEditInfo.teacherId;
            this.$comjs.getUseList(this, params);
        },
        changeTeacher(val) {
            if (val) {
                this.getUseList();
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 5px 5px 54px 60px;
}

.notice-wrap {
    display: inline-block;
    padding: 23px 80px 24px 80px;
    font-size: 14px;
    color: #303133;
    background: #eff3f9;

    p {
        line-height: 24px;
    }
}

.item-scroll {
    overflow: hidden;
    height: 100%;
    width: 100%;

    .box {
        overflow-y: scroll;
        width: 100%;
        height: 100%;
    }
}

.item-wrap {
    display: flex;
    align-items: center;
    margin-top: 25px;
    min-width: 1200px;
    font-size: 14px;
    color: #303133;

    em {
        color: #f64646;
    }

    p:first-child {
        width: 105px;
        height: 40px;
        line-height: 40px;
        // text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }

    .elTag {
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
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

.edit-btn {
    width: 160px;
    height: 40px;
    margin: 35px 0 60px 30px;
}

.err-notice {
    margin-left: 20px;
    color: #b3b6ba;
    font-size: 12px;

    &.err-color {
        color: #f64646;
    }
}

.itemType {
    float: left;
    padding-left: 10px;
    // padding-bottom: 10px;

    .p {
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
        float: left;
    }

    .el-select {
        float: left !important;
    }
}

.tip {
    text-align: center;
}

::v-deep .upload-demo .el-upload-list {
    margin: -145px 0 0 15px !important;
    width: 250px;
}

.edufile .el-upload-list {
    margin: 0 !important;
}

.edufile .el-upload-list__item-name {
    padding: 0 !important;
    overflow: hidden;
    width: 240px !important;
    text-overflow: ellipsis;
}

::v-deep .edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}

.upload-demo {
    height: 160px;
}

::v-deep .el-upload-dragger {
    width: 280px;
    height: 130px;
}

::v-deep .el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}

::v-deep .el-upload-list__item-status-label {
    display: block;
}

::v-deep .upload-edufile .el-upload-list {
    // margin: 0 0 0 25px;
    width: 300px;
}

.el-divider {
    width: 400px;
}
.ml20 {
    margin-left: 120px;
}
#vp {
    display: none;
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
    margin-top: 10px;
    font-size: 12px;
    color: grey;
    margin-left: 105px;
}

.el-upload-tip {
    font-size: 12px;
    color: gray;
    margin-top: 10px;
}
</style>

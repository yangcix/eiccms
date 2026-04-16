<!-- recordlist -->
<template>
    <div v-if="type == 1" class="box">
        <div class="header">
            <div class="left">
                <div class="item">我的磨课（{{ total }}次）</div>
            </div>
            <div class="right">
                <el-button v-if="permission.save" icon="el-icon-plus" size="small" type="primary" @click="addLive"
                    >新增AI磨课
                </el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="content" v-if="list.length && list.length > 0">
            <div class="item" v-for="(val, index) in list" :key="index">
                <div class="left">
                    <div class="img-wrap">
                        <img :src="val.coverUrl ? val.coverUrl : defaultImg" alt="" :onerror="defaultImg" />
                        <p class="video-status status1" v-if="val.type == 1">
                            <span class="playAnimation">
                                <span class="animationli"></span>
                                <span class="animationli"></span>
                                <span class="animationli"></span>
                                <span class="animationli"></span> </span
                            >磨课中
                        </p>
                        <p class="video-status status0" v-if="val.type == 0">
                            <i class="el-icon-alarm-clock"></i>未开始
                        </p>
                        <p class="video-status status2" v-if="val.type == 2">
                            <i class="el-icon-refresh-left"></i>已结束
                        </p>
                        <!-- <div v-else>
              <p class="video-status status2" v-if="val.status == 0"><i class="el-icon-refresh-left"></i>待提交</p>
              <p class="video-status status2" v-if="val.status == 1"><i class="el-icon-refresh-left"></i>待审核</p>
              <p class="video-status status2" v-if="val.status == 2"><i class="el-icon-refresh-left"></i>待发布</p>
              <p class="video-status status2" v-if="val.status == 3"><i class="el-icon-refresh-left"></i>已驳回</p>
            </div> -->
                    </div>
                    <div class="right">
                        <div style="display: flex">
                            <div class="title" :title="val.name">{{ val.name }}</div>
                            <span class="resources">{{
                                val.resources == 1
                                    ? '排课录制'
                                    : val.resources == 2
                                    ? '本地上传'
                                    : val.resources == 3
                                    ? '智课终端'
                                    : '历史录制资源'
                            }}</span>
                        </div>
                        <div class="main">
                            <div>
                                <div style="width: 200px; margin-bottom: 5px; font-size: 14px">
                                    学科：{{ val.subjectName }}
                                </div>
                            </div>
                            <div v-if="val.resources == 1 || val.resources == 3">
                                <div style="width: 200px; font-size: 14px">开始时间：{{ val.startTime }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnbox">
                    <el-button
                        v-if="val.type == 0"
                        type="primary"
                        style="width: 110px; margin-top: 5px"
                        size="mini"
                        @click="deleteData(0, val)"
                        >删除
                    </el-button>
                    <el-button
                        v-if="val.type == 0"
                        type="primary"
                        style="width: 110px; margin-left: 0; margin-top: 5px"
                        size="mini"
                        @click="editData(val)"
                        >编辑
                    </el-button>
                    <el-button
                        v-if="val.type == 2 && val.aiStatus != 3"
                        type="primary"
                        style="width: 110px; margin-left: 0; margin-top: 5px"
                        size="mini"
                        @click="openReport(val)"
                        >查看复盘/报告
                    </el-button>
                    <el-button
                        v-if="val.aiConfigId == 2 && val.aiStatus == 3 && val.isResetting == 0"
                        type="primary"
                        @click="resetting(val)"
                        size="mini"
                        style="width: 110px; margin-top: 5px; margin-left: 0px"
                        >重置分析
                    </el-button>
                    <el-button
                        v-if="val.aiConfigId == 2 && val.aiStatus == 3 && val.isResetting == 1"
                        type="primary"
                        size="mini"
                        style="width: 110px; margin-top: 5px; margin-left: 0px; color: #b3b6ba"
                        plain
                        disabled
                        >重置分析
                    </el-button>
                    <div v-if="val.resources == 3" style="margin-top: 5px">
                        <el-button
                            v-if="val.type == 2"
                            type="primary"
                            style="width: 110px; margin-left: 0; margin-top: 5px"
                            size="mini"
                            @click="handleAleat(val)"
                            >播放视频
                        </el-button>
                    </div>
                    <div v-else style="margin-top: 5px">
                        <el-button
                            v-if="val.type != 0"
                            type="primary"
                            style="width: 110px; margin-left: 0; margin-top: 5px"
                            size="mini"
                            @click="handleAleat(val)"
                            >播放视频
                        </el-button>
                    </div>

                    <!-- <el-button v-if="val.convertStatus != 2" style="width: 65px;margin-left: 0;" type="primary" size="mini"
            @click="submit(0, val)">送审</el-button> -->
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
            <p>{{ permission.length == 0 ? '暂无访问权限！' : '暂无内容！' }}</p>
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
            title="删除磨课"
            :append-to-body="true"
            :visible.sync="deleteShow"
            style="margin-top: 16vh"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-delete">确认删除该磨课？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData(1)">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            :title="patchData.name + (patchData.type == 1 ? '(磨课中)' : '(已结束)')"
            :close-on-click-modal="false"
            class="videoBox"
            :append-to-body="true"
            :visible.sync="alertVideo"
            width="640px"
            :before-close="handleClose"
        >
            <div id="videoAlert" ref="videoAlert"></div>
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
            {{ addEditInfo.id ? '编辑' : '新增' }}AI磨课
        </div>
        <el-divider></el-divider>
        <div class="addBox">
            <div class="item-wrap" v-if="aiType == 2 && feeModel == 1">
                <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                <p>{{ aiNum }}次</p>
            </div>
            <div class="item-wrap">
                <p>优先使用<em>*</em>：</p>
                <el-select
                    :popper-append-to-body="false"
                    v-model="addEditInfo.aiProjectId"
                    class="width-2"
                    size="small"
                    style="width: 300px; margin-right: 2px"
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
            <div class="item-wrap" v-show="!addEditInfo.id">
                <p>资源来源<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-radio-group v-model="addEditInfo.resources">
                    <el-radio :label="1">排课录制</el-radio>
                    <el-radio :label="2">本地上传</el-radio>
                    <el-radio :label="3">智课终端</el-radio>
                    <el-radio :label="4">历史录制资源</el-radio>
                    <el-tooltip :content="tooltipContent" placement="right" effect="dark">
                        <i
                            v-if="aiType == 2"
                            class="iconfont icon-wenhao"
                            style="margin-left: -20px; color: rgb(121, 145, 255)"
                        ></i>
                    </el-tooltip>
                </el-radio-group>
                <!-- <p class="err-notice" style="margin-left: 10px">
          注：将自动录制开始时间到结束时间区间范围的视频进行AI分析，请合理安排好时间！
        </p> -->
            </div>
            <p v-if="addEditInfo.resources == 1 && !addEditInfo.id" class="notes">
                注：将自动录制开始时间到结束时间区间范围的视频进行AI分析，请合理安排好时间！
            </p>
            <p v-if="addEditInfo.resources == 3 && !addEditInfo.id" class="notes" style="width: 541px">
                注：将<span style="color: red">手动</span
                >录制开始时间到结束时间区间范围的视频进行AI分析，需小于60分钟，请合理安排好时间！
            </p>
            <div class="item-wrap" v-if="addEditInfo.resources == 3">
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
            <div v-if="addEditInfo.resources == 2" class="item-wrap item-wrap upload-box videoList">
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
                        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409eff">点击上传</em></div>
                        <div class="el-upload-tip" slot="tip">
                            <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过1.8G
                        </div>
                    </el-upload>
                    <div id="vp" ref="vp"></div>
                </div>
                <p
                    v-if="aiType == 1"
                    style="line-height: 40px; color: #303133; font-size: 14px; width: 110px; margin-left: 10px"
                >
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
                        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409eff">点击上传</em></div>
                        <div class="el-upload-tip" slot="tip">
                            <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过3G
                        </div>
                    </el-upload>
                </div>
            </div>
            <div v-if="addEditInfo.resources == 4" class="item-wrap">
                <p>课堂视频<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-tag
                    class="elTag"
                    v-if="objectName"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseVideoTag()"
                >
                    {{ objectName }}
                </el-tag>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">
                    {{ addEditInfo.recordId ? '更改资源' : '选择资源' }}
                </el-button>
            </div>
            <p
                v-if="aiType == 2 && addEditInfo.resources == 4"
                :style="{fontSize: '14px', color: 'red', marginLeft: '105px', marginTop: '10px'}"
            >
                注：仅可选择时长不可超过60分钟的视频资源
            </p>
            <p
                v-if="addEditInfo.resources == 2"
                style="font-size: 14px; color: red; margin-top: 10px; margin-left: 108px"
            >
                注：上传的视频资源要与页面填写信息一致，不然将会影响AI分析结果的准确性
            </p>
            <div class="item-wrap">
                <div style="display: flex">
                    <p>课程名称<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-input
                        class="width-2"
                        size="small"
                        v-model="addEditInfo.name"
                        placeholder="请输入课程名称"
                        clearable
                        style="width: 300px"
                    ></el-input>
                </div>
            </div>
            <div class="item-wrap">
                <div style="display: flex">
                    <p>课堂类型<em style="margin-left: 5px; line-height: 14px">*</em></p>
                    <el-radio-group
                        v-model="addEditInfo.classTypeId"
                        style="display: flex; justify-content: center; align-items: center"
                    >
                        <el-radio v-for="(item, index) in classTypeList" :label="item.id" :key="index"
                            >{{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                <p>开始时间<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-date-picker
                    size="small"
                    v-model="addEditInfo.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间"
                    @change="clearTerminal"
                    style="width: 300px"
                >
                </el-date-picker>
                <p v-if="addEditInfo.resources == 1" class="err-notice">
                    <em>*</em>需大于当前时间，若小于时默认创建时间
                </p>
                <p v-if="addEditInfo.resources == 3" class="err-notice">
                    <em>*</em>需大于当前时间，该时间为预设时间，具体开始时间以实际开始录制时间为准
                </p>
            </div>

            <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                <p>课堂时长<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-input
                    style="width: 300px"
                    v-model="addEditInfo.durationMinutes"
                    clearable
                    placeholder="请输入课堂时长"
                    size="small"
                    @change="changeDurationMin"
                ></el-input>&nbsp;分钟
                <p class="err-notice"><em>*</em>课堂时长最多60分钟</p>
            </div>
            <div class="item-wrap">
                <p>学科<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    size="small"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.subjectId"
                    placeholder="选择学科"
                    class="width-2"
                    style="width: 300px; margin-right: 2px"
                    filterable
                >
                    <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item-wrap">
                <p>磨课班级<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    size="small"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.grindingSchool"
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
                    v-model="addEditInfo.grindingGrade"
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
                    v-model="addEditInfo.grindingClass"
                    @change="changeClass()"
                    placeholder="选择班级"
                    style="margin-right: 10px; width: 130px"
                    filterable
                >
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                <p>磨课位置<em style="margin-left: 5px; line-height: 14px">*</em></p>
                <el-select
                    size="small"
                    :popper-append-to-body="false"
                    v-model="addEditInfo.grindingBuilding"
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
                    :popper-append-to-body="false"
                    v-model="addEditInfo.grindingClassroom"
                    @change="classroomChange(1)"
                    placeholder="请选择教室"
                    style="width: 130px"
                    filterable
                >
                    <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                <p><em style="margin-left: 5px; line-height: 14px"></em></p>
                <span v-if="ternalName !== ''" style="color: #999; font-size: 14px">{{ ternalName }}</span>
                <span v-else style="color: #999; font-size: 14px">无设备</span>
                <!-- <el-select size="small" :popper-append-to-body="false" v-model="addEditInfo.terminalId" placeholder="请选择设备"
            class="width-2" filterable>
            <el-option v-for="item in terminalIdList" :key="item.id" :label="item.terminalName" :value="item.id">
            </el-option>
          </el-select> -->
                <!-- <p class="err-notice">注：提前添加设备并绑定至直播教室</p> -->
            </div>
            <div class="item-wrap edufile">
                <!--   <em style="margin-left: 5px; line-height: 14px">*</em>     -->
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
                    <div slot="tip" class="el-upload-tip">仅支持上传后缀为docx文件，文件50M以下</div>
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
                        <div class="el-upload-tip" slot="tip">仅支持上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </div>
            </div>
            <div style="text-align: center; margin: 10px 0 20px 0">
                <el-button size="mini" class="edit-btn" @click="httpRequest(true)">暂存</el-button>
                <el-button size="mini" type="primary" class="edit-btn" @click="httpRequest(false)">提交</el-button>
            </div>

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
                                                    :disabled="addEditInfo.recordId === scope.row.id"
                                                    :underline="false"
                                                    type="primary"
                                                    @click="handleAddTotalData(scope.row)"
                                                    >添加
                                                </el-link>
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
import FlvJsPlayer from 'xgplayer-flv.js';
import nullimg from '../../../../assets/imgs/home-null.png';
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';

export default {
    name: '',
    data() {
        return {
            aiNum: 0,
            aiStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
            videoSizes: '',
            videoSizet: '',
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            feeModel: JSON.parse(localStorage.getItem('sysInfo')).type,
            studentVideo: [],
            teacherVideo: [],
            playUrl: '',
            vp: null,
            videoId: 1,
            classTypeList: [],
            checkItem: null,
            ternalName: '',
            gradeList: [],
            classList: [],
            subjectList: [],
            nullimg: nullimg,
            submitRow: {},
            submitShow: false,
            deleteRow: {},
            deleteShow: false,
            fileList: [],
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            edufileList: [], // 已上传文件
            groupList: [],
            type: 1,
            actives: 1,
            pageNum: 1,
            pages: 0,
            total: 0,
            uploadUrl: baseUrl + '/sm/label/save',
            list: [],
            themeValue: '',
            themeTypeList: [],
            addEditInfo: {
                classTypeId: '',
                resources: 1,
                teacherId: JSON.parse(window.localStorage.getItem('userInfo'))
                    ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                    : '',
                grindingSchool: '', //学校id
                grindingClassroom: '', //教室id
                grindingBuilding: '', //教学楼id
                terminalId: '', //选择的 直播设备
                subjectId: '',
                grindingClass: '',
                grindingGrade: '',
                studentVideo: '',
                teacherVideo: '',
                recordId: '', // 绑定视频id
                recordingMethod: 0,
            },
            patchData: {},
            alertVideo: false,
            permission: '',
            schoolList: [], // 可选择的学校
            buildlList: [], // 可选的教学楼
            classroomList: [], // 可选的教室
            terminalIdList: [], //可选的 直播设备 数组
            teachingFileIds: [], // 一键发布时上传文件数组
            resettingShow: false,
            resettingVal: {},
            themeData: [
                {
                    id: 1,
                    name: '实时研修',
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
            ],
            myVideo: null,
            defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
            loadingVideo: false, // 视频列表加载
            tooltipContent: '为巡课录制完成并存储在系统的视频',
            videoListData: [], // 录制视频列表数据
            videoPermission: '', // 录制视频权限
            videoShow: false,
            videoActiveName: 'first',
            videoName: '',
            page: 0,
            pageNumber: 1,
            totalS: '',
            playVisible: false, // 视频播放窗口
            video: null,
            objectName: '', // 绑定视频名称
            recordingMethodList: [
                {name: '自动录制', id: 0},
                {name: '手动录制', id: 1},
            ],
            isChangeVideo: false,
            useList: [],
        };
    },
    computed: {
        ...mapState({
            aiUploadTable: 'aiUploadTable',
        }),
    },
    mounted() {
        this.getList();
        this.getSubjectList();
        this.getSchoolList(); //获取学校列表
        this.getgroupList(); //获取用户组列表
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
            this.isChangeVideo = true;
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
                this.initVP();
                this.videoId = 1;
                this.addEditInfo.teacherVideo = file.raw;
                this.isChangeVideo = true;
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
                this.initVP();
                this.videoId = 2;
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
        getClassTypeList(val) {
            this.$axios.get('/aiGrinding/getClassType').then((res) => {
                this.classTypeList = res.data;
                if (val == 1) {
                    this.addEditInfo.classTypeId = res.data[0].id;
                }
            });
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        openReport(val) {
            if (val.resources == 3 && (val.url == null || val.url == '')) {
                this.$message('视频未上传，无法生成报告', 'error');
                return;
            }
            if (val.aiStatus == 0 || val.aiStatus == 1) {
                this.$message('报告生成中，请稍后再试！', 'error');
                return;
            }
            if (val.aiStatus == 3) {
                this.$message('报告生成失败，请联系管理员！', 'error');
                return;
            }
            if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                window.open('/aiReport?id=' + val.id, '_blank');
            } else {
                window.open(val.aiReport, '_blank');
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
        checkTime() {
            let data = {
                pageNum: this.pageNum,
                pageSize: 5,
                dataSources: 1,
            };
            this.$axios.get('/index/personal/list', data).then((res) => {
                this.list = res.data.pageList;
                if (res.data.permit.length > 0) {
                    this.permission = this.creatPermit(res.data.permit);
                } else {
                    this.permission = [];
                }
                this.pages = res.data.pages;
                this.total = res.data.total;
                let val = this.list.find((el) => el.id == this.patchData.id);
                this.patchData = val;
                this.handelGetVideo(val);
            });
        },
        handelGetVideo(val) {
            if (this.myVideo) {
                this.myVideo = null;
            }
            if (this.checkItem !== null) {
                clearInterval(this.checkItem);
            }
            if (val.type == 1) {
                this.checkItem = setInterval(() => {
                    if (this.myVideo !== null && this.myVideo.mediainfo) {
                        console.log(this.myVideo.mediainfo);
                        if (this.myVideo.mediainfo.hasAudio == true) {
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
                        enableStashBuffer: true, //启用缓存
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
                        clearInterval(_this.checkItem);
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
        // 视频预览
        handleAleat(row) {
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
                if (row.type == 0) {
                    return;
                }
                this.patchData = row;
                this.alertVideo = true;
                setTimeout(() => {
                    this.handelGetVideo(row);
                }, 100);
            }
        },
        changeGrade() {
            this.addEditInfo.grindingClass = '';
            this.getClassList();
        },
        changeClass() {
            this.$forceUpdate();
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        getGradeList(id) {
            this.$axios.get('/aiGrinding/getGrade?orgId=' + id + '').then((res) => {
                this.gradeList = res.data;
            });
        },
        getClassList() {
            this.$axios.get('/aiGrinding/getClass?id=' + this.addEditInfo.grindingGrade).then((res) => {
                this.classList = res.data;
            });
        },
        judgeEndTime(time) {
            if (getNowDate() > time) {
                this.$message('该主题已过结束时间，无法操作', 'error');
                return true;
            }
            return false;
        },
        //送审 0送审 1送审确定
        submit(type, val) {
            if (type == 0) {
                if (val.status != 0) {
                    return;
                }
                if (this.judgeEndTime(val.endTime)) {
                    return;
                }
                this.submitRow = val;
                this.submitShow = true;
            } else {
                this.$axios.post('/sm/theme/submit', {id: this.submitRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.submitShow = false;
                        this.$message('送审成功', 'success');
                        this.getThemeList();
                    }
                });
            }
        },
        editData(val) {
            if (this.aiType == 2) {
                this.getCount();
            }
            this.getUseList();
            this.$axios.get('/index/personal/aiGrinding/info', {id: val.id}).then((res) => {
                this.valData = res.data.labelList;
                if (res.data.coverUrl) {
                    this.fileList = [{name: '', url: res.data.coverUrl}];
                } else {
                    this.fileList = [];
                }
                let edufileList = res.data.teachingFileList;
                if (edufileList != null && edufileList != '[]' && edufileList != '') {
                    this.teachingFileIds = edufileList.map((i) => i.id);
                    this.edufileList = edufileList;
                } else {
                    this.edufileList = [];
                }
                // this.edufileList = res.data.teachingFileList;
                // this.teachingFileIds = this.edufileList.map((i) => i.id);
                this.addEditInfo = res.data;
                this.addEditInfo.durationMinutes = this.$comjs.createDuraTionMin(
                    this.addEditInfo.startTime,
                    this.addEditInfo.endTime
                );
                this.getGradeList(res.data.grindingSchool);
                this.getClassList();
                this.getTeachBuildList(res.data.grindingSchool);
                if (res.data.resources == 1 || res.data.resources == 3) {
                    this.getClassroomList(res.data.grindingBuilding);
                    this.getTerminalIdList();
                } else {
                    this.teacherVideo = [{name: '', url: res.data.teacherVideoUrl}];
                    setTimeout(() => {
                        this.playUrl = res.data.teacherVideoUrl;
                        this.videoId = 1;
                        this.initVP();
                    }, 300);
                    if (res.data.aiConfigId == 1) {
                        this.studentVideo = [{name: '', url: res.data.studentVideoUrl}];
                        setTimeout(() => {
                            this.playUrl = res.data.studentVideoUrl;
                            this.videoId = 2;
                            this.initVP();
                        }, 800);
                    }
                }
                this.getClassTypeList(2);
                this.type = 2;
            });
        },
        //删除 0删除 1删除确定
        deleteData(type, val) {
            if (type == 0) {
                this.deleteRow = val;
                this.deleteShow = true;
            } else {
                let data = new FormData();
                data.append('id', this.deleteRow.id);
                this.$axios.post('/index/personal/aiGrinding/delete', data).then((res) => {
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
        addLive(val) {
            if (val == 1) {
                this.type = 1;
                this.getList();
            } else {
                if (this.aiType == 2) {
                    this.getCount();
                }
                this.objectName = '';
                this.themeValue = '';
                this.edufileList = [];
                this.teachingFileIds = [];
                this.ternalName = '';
                this.fileList = [];
                this.addEditInfo = {
                    resources: 1,
                    classTypeId: '',
                    teacherId: JSON.parse(window.localStorage.getItem('userInfo'))
                        ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                        : '',
                    grindingSchool: '', //学校id
                    grindingClassroom: '', //教室id
                    grindingBuilding: '', //教学楼id
                    terminalId: '', //选择的 直播设备
                    subjectId: '',
                    grindingClass: '',
                    grindingGrade: '',
                    teacherVideo: '',
                    studentVideo: '',
                    objectId: '',
                    recordId: '',
                    objectName: '',
                    recordingMethod: 0,
                };
                this.getUseList();
                this.type = 2;
                this.getClassTypeList(1);
            }
        },
        changeTab(type) {
            this.actives = type;
            this.getList();
        },
        getList() {
            let data = {
                pageNum: this.pageNum,
                pageSize: 5,
                dataSources: 1,
            };
            this.$axios.get('/index/personal/list', data).then((res) => {
                this.list = res.data.pageList;
                if (res.data.permit.length > 0) {
                    this.permission = this.creatPermit(res.data.permit);
                } else {
                    this.permission = [];
                }
                this.pages = res.data.pages;
                this.total = res.data.total;
            });
        },
        removeFile(file) {
            this.addEditInfo.coverUrl = '';
            this.addEditInfo.file = null;
        },
        // 移除文件
        handleRemove(file, fileList) {
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
            this.$axios.get('/sm/theme/getSysGroup').then((res) => {
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
            let data = {
                famous: 0,
            };
            if (this.themeValue == 7) {
                data.famous = 1;
            }
            this.$axios.get('/sm/interactive/getUser', data).then((res) => {
                this.teacherList = res.data;
            });
        },
        getTypeList() {
            this.$axios
                .get('/sm/label/listByCategory', {
                    categoryId: this.themeValue,
                    type: 0,
                    id: this.$route.query.themeid,
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
                // 	this.addEditInfo.grindingBuilding = this.buildlList[0].id;
                // 	if (this.addEditInfo.grindingBuilding) {
                // 		this.getClassroomList(this.addEditInfo.grindingBuilding);
                // 	}
                // }
            });
        },
        //根据教学楼id获取教室列表
        getClassroomList(grindingBuilding) {
            this.$axios
                .get('/sys/classroom/getClassroomList', {
                    buildingId: grindingBuilding,
                })
                .then((res) => {
                    this.classroomList = res.data;
                    // if (this.classroomList.length > 0) {
                    // 	this.addEditInfo.grindingClassroom = this.classroomList[0].id;
                    // }
                });
        },
        //选择学校后 教学楼、教室修改
        shcoolChange(id) {
            // this.recodeList = [];
            this.buildlList = [];
            this.addEditInfo.grindingGrade = '';
            this.addEditInfo.grindingClass = '';
            this.addEditInfo.grindingBuilding = '';
            this.addEditInfo.grindingClassroom = '';
            this.addEditInfo.terminalId = '';
            this.ternalName = '';
            this.classroomList = [];
            this.classroomChange();
            this.getGradeList(id);
            this.getTeachBuildList(id);
        },
        clearTerminal() {
            this.calcEndTime();
            if (this.addEditInfo.grindingClassroom) {
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
            if (!this.addEditInfo.startTime || !this.addEditInfo.durationMinutes) return;
            this.addEditInfo.endTime = this.$comjs.addMinutesByTimestamp(
                this.addEditInfo.startTime,
                this.addEditInfo.durationMinutes
            );
            console.log('获取到的结束时间---', this.addEditInfo.endTime);
        },
        //教学楼改变后教室修改
        buildChange(id) {
            // this.recodeList = [];
            this.addEditInfo.grindingClassroom = '';
            this.addEditInfo.terminalId = '';
            this.classroomList = [];
            this.classroomChange();
            this.getClassroomList(id);
        },
        //教室改变后直播设备改变 录制机位改变
        classroomChange(type) {
            // this.recodeList = [];
            this.ternalName = '';
            this.addEditInfo.terminalId = '';
            this.terminalIdList = [];
            // this.addEditInfo.terminalIdList = [];
            this.addEditInfo.terminalIdList = '';
            // this.addEditInfo.recodeIdList = '';
            if (type) {
                this.getTerminalIdList('room');
            }
            // this.terminalChange();
        },
        getTerminalIdList(room) {
            let data = {
                classroomId: this.addEditInfo.grindingClassroom,
                startTime: this.addEditInfo.startTime,
                endTime: this.addEditInfo.endTime,
                type: 2,
                resources: this.addEditInfo.resources,
            };
            if (this.addEditInfo.id) {
                data.themeId = this.addEditInfo.id;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                // debugger
                this.terminalIdList = res.data;
                this.ternalName =
                    this.terminalIdList[0] && this.terminalIdList[0].terminalName
                        ? this.terminalIdList[0].terminalName
                        : '';
                if (!this.addEditInfo.id || room === 'room') {
                    // 新增
                    const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';

                    this.addEditInfo.terminalId = id ? id : '';
                }
            });
        },
        //覆盖默认上传，手动上传
        httpRequest(isTranslationPending) {
            if (this.verify()) {
                return;
            }
            let arrs = [];
            let arrays = [];
            this.aiUploadTable.forEach((el) => {
                arrs.push(el.uploadId);
            });
            arrays = Array.from(new Set(arrs));
            if (arrays.length >= 5) {
                return this.$message('最多可以同时上传5个评课或磨课，请稍后再试！', 'error');
            }
            if (
                this.aiUploadTable.findIndex((item, i) => {
                    return (
                        (item.name == this.addEditInfo.name + '教师画面' ||
                            item.name == this.addEditInfo.name + '视频') &&
                        item.type == 2
                    );
                }) === -1
            ) {
                let formData = new FormData();
                let judgeData = {};
                judgeData.name = this.addEditInfo.name;
                if (this.addEditInfo.id) {
                    judgeData.id = this.addEditInfo.id;
                }
                this.$axios.post('/aiGrinding/check', judgeData).then((res) => {
                    if (res.code == 200) {
                        if (this.addEditInfo.file) {
                            formData.append('file', this.addEditInfo.file);
                        }
                        formData.append('name', this.addEditInfo.name);
                        formData.append('resources', this.addEditInfo.resources);
                        formData.append('classTypeId', this.addEditInfo.classTypeId);
                        formData.append('aiConfigId', this.aiType);
                        if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                            formData.append('startTime', this.addEditInfo.startTime);
                            formData.append('endTime', this.addEditInfo.endTime);
                            formData.append('grindingBuilding', this.addEditInfo.grindingBuilding);
                            formData.append('grindingClassroom', this.addEditInfo.grindingClassroom);
                            formData.append('terminalId', this.addEditInfo.terminalId);
                            if (this.addEditInfo.resources == 3) {
                                formData.append('recordingMethod', this.addEditInfo.recordingMethod);
                            }
                        } else if (this.addEditInfo.resources == 2) {
                            if (this.addEditInfo.teacherVideo) {
                                formData.append('teacherVideo', this.addEditInfo.teacherVideo);
                                if (this.aiType == 1 && this.addEditInfo.studentVideo) {
                                    formData.append('studentVideo', this.addEditInfo.studentVideo);
                                }
                            }
                        } else if (this.addEditInfo.resources == 4) {
                            formData.append('recordId', this.addEditInfo.recordId);
                        }
                        formData.append('grindingGrade', this.addEditInfo.grindingGrade);
                        formData.append('grindingClass', this.addEditInfo.grindingClass);
                        formData.append('grindingSchool', this.addEditInfo.grindingSchool);
                        formData.append('subjectId', this.addEditInfo.subjectId);
                        formData.append('teacherId', this.addEditInfo.teacherId);
                        formData.append('planFile', this.teachingFileIds);
                        formData.append('aiProjectId', this.addEditInfo.aiProjectId);
                        let url = '/index/personal/aiGrinding/save';
                        if (this.addEditInfo.id) {
                            // 编辑更新
                            url = '/index/personal/aiGrinding/update';
                            formData.append('id', this.addEditInfo.id);
                            if (!this.addEditInfo.file && this.addEditInfo.coverUrl) {
                                formData.append('coverUrl', this.addEditInfo.coverUrl);
                            }
                            // 编辑的时候且是本地视频：才需要判断视频是否有更换
                            if (this.addEditInfo.resources == 2) {
                                formData.append('teacherVideoNew', this.isChangeVideo ? 1 : 0);
                            }
                        }
                        // 暂存传值：type == -1
                        if (isTranslationPending) {
                            formData.append('type', -1);
                        }
                        let uploadId;
                        if (this.addEditInfo.resources == 2) {
                            // 判断编辑是否有替换视频
                            if (this.addEditInfo.teacherVideo) {
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
                                        type: 2, //1 评课 2 AI
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
                            if (this.addEditInfo.studentVideo) {
                                // 上传列表s
                                let uploadIds = this.aiUploadTable.length;
                                let uploadTbaleData = {
                                    type: 'push',
                                    item: {
                                        uploadId: uploadIds - 1,
                                        name: this.addEditInfo.name + '学生画面',
                                        status: 1, // 0 上传失败 1上传中 //2已取消
                                        size: this.videoSizes,
                                        type: 2, //1 评课 2 AI
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
                            this.type = 1;
                            this.getList();
                            if (this.addEditInfo.teacherVideo && this.addEditInfo.teacherVideo !== null) {
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
                                    if (this.addEditInfo.resources == 2) {
                                        // 这就是 真·上传进度
                                        let percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                        let msg = {};
                                        if (this.addEditInfo.teacherVideo) {
                                            msg = {
                                                fileName: this.addEditInfo.teacherVideo.name.slice(
                                                    0,
                                                    this.addEditInfo.teacherVideo.name.length - 4
                                                ),
                                                progress: percent,
                                            };
                                        }
                                        if (this.addEditInfo.studentVideo) {
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
                                        if (formData.get('teacherVideo') && formData.get('resources') == 2) {
                                            this.commitAiUploadTable({
                                                type: 'splice',
                                                detail: formData, // 视频id
                                            });
                                        } else {
                                            this.type = 1;
                                        }
                                        setTimeout(() => {
                                            this.getList();
                                            this.$message(res.data, 'success');
                                        }, 300);
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
                this.$message('磨课名称重复，该磨课正在上传', 'error');
            }
        },
        // 选择视频资源
        handleAdd() {
            this.videoShow = true;
            this.pageNum = 1;
            this.videoName = '';
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
                    this.handelSelectVideo(url);
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        // 关闭播放
        closePlay() {
            this.video.src = null;
            this.playVisible = false;
        },
        // 视频初始化
        handelSelectVideo(params) {
            if (this.video !== null) {
                this.video.destroy();
                this.video = new Player({
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
                this.video = new Player({
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
        handleAddTotalData(row) {
            let minutes = parseInt(row.time?.split(':')[1], 10);
            console.log(minutes, 'time后台ai磨课');
            if (minutes > 60) {
                this.$message('视频时长不能超过60分钟', 'error');
                return;
            }
            this.addEditInfo.recordId = row.id;
            this.objectName = row.name;
            this.videoShow = false;
        },
        // 减少视频
        handleCloseVideoTag() {
            this.addEditInfo.recordId = '';
            this.objectName = '';
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
            if (this.aiType == 2 && this.feeModel == 1 && this.aiNum == 0) {
                this.$message('AI分析剩余次数不足！', 'error');
                return true;
            }
            if (this.addEditInfo.resources == 2) {
                if (this.addEditInfo.id && this.isChangeVideo) {
                    if (!this.addEditInfo.id && this.$verify.isEmpty(this.addEditInfo.teacherVideo)) {
                        this.$message(this.aiType == 1 ? '请上传教师画面视频' : '请上传视频', 'error');
                        return true;
                    }
                    if (
                        !this.addEditInfo.id &&
                        this.$verify.isEmpty(this.addEditInfo.studentVideo) &&
                        this.aiType == 1
                    ) {
                        this.$message('请上传学生画面视频', 'error');
                        return true;
                    }
                }
            } else if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                if (
                    this.addEditInfo.startTime === '' ||
                    this.addEditInfo.startTime === null ||
                    this.addEditInfo.startTime == undefined
                ) {
                    this.$message('请选择开始时间', 'error');
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
            } else if (this.addEditInfo.resources == 4) {
                if (!this.addEditInfo.recordId) {
                    this.$message('请选择课堂视频', 'error');
                    return true;
                }
            }
            if (!this.addEditInfo.name) {
                this.$message('请输入课程名称', 'error');
                return true;
            }
            if (this.addEditInfo.name.length > 100) {
                this.$message('课程名称长度限制100字符内！', 'error');
                return true;
            }
            if (!this.addEditInfo.subjectId) {
                this.$message('学科必填', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.grindingSchool)) {
                this.$message('请选择学校', 'error');
                return true;
            }
            if (!this.addEditInfo.grindingGrade) {
                this.$message('年级必填', 'error');
                return true;
            }
            if (!this.addEditInfo.grindingClass) {
                this.$message('班级必填', 'error');
                return true;
            }
            if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                if (this.$verify.isEmpty(this.addEditInfo.grindingBuilding)) {
                    this.$message('请选择教学楼', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.grindingClassroom)) {
                    this.$message('请选择教室', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.terminalId)) {
                    this.$message('当前磨课位置无设备可用，请更改磨课位置', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.resources == 4) {
                if (this.$verify.isEmpty(this.addEditInfo.recordId)) {
                    this.$message('请选择课堂视频', 'error');
                    return true;
                }
            }
            if (this.teachingFileIds.length == 0) {
                this.$message('教案必须上传！', 'error');
                return true;
            }
        },
        //重置分析弹窗
        resetting(val) {
            if (val.isResetting != 0) {
                return;
            }
            this.resettingVal = val;
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
                this.$axios.post('/aiGrinding/resetAnalysis', data).then((res) => {
                    if (res.code === 200) {
                        this.resettingShow = false;
                        this.$message(res.data, 'success');
                        this.getList();
                    }
                });
            });
        },
        getUseList() {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            this.$axios
                .get('/aiAnalysisRecharge/quota', {productType: 1, currentUserId: this.addEditInfo.teacherId})
                .then((res) => {
                    if (res.code == 200) {
                        this.useList = res.data.options;
                        this.aiNum = res.data.totalResidue;
                        // 有数据的话默认选中第一项
                        if (this.useList.length != 0) {
                            this.$set(this.addEditInfo, 'aiProjectId', this.useList[0].allocationId);
                        }
                    }
                });
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

::v-deep .videoEnd {
    width: 600px;
    height: 337.5px;
    background: #000;

    p {
        color: white;
        text-align: center;
        line-height: 337.5px;
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
    padding: 15px;

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

    .header {
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;

            .item {
                cursor: pointer;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
            }
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
                // justify-content: space-between;
                // align-items: center;
            }

            .btnbox button:first-child {
                margin-top: 0 !important;
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
                    div {
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

.videoBox {
    ::v-deep .el-dialog__body {
        padding: 0 20px 30px 20px;
    }
}

#vp {
    display: none;
}

::v-deep .el-upload-list__item-name {
    max-width: 610px;
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

.elTag {
    max-width: 600px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
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

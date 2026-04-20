<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header @back="goBack" :content="`${$route.query.projectName}`"></el-page-header>
        </p>
        <div class="content-main-wrap" style="min-width: 1260px; overflow-x: auto; overflow-y: auto">
            <div class="content-overflow">
                <div class="main-wrap" style="min-width: 1260px; overflow-x: auto">
                    <div class="search-operat-new">
                        <div v-if="isCurSchoolType == 1">
                            <el-input
                                v-model="keyWord"
                                class="width-2"
                                placeholder="请输入姓名/编号关键字"
                                clearable
                            ></el-input>
                            <span class="search-desc">状态：</span>
                            <el-select v-model="status" placeholder="请选择" class="width-8">
                                <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                            <el-button
                                class="search-btn"
                                style="position: relative; right: 0; float: right"
                                @click="consumeConfig(0)"
                                >消耗配置
                            </el-button>
                            <el-button
                                class="search-btn"
                                style="position: relative; right: 0; float: right"
                                @click="batchData()"
                                >批量分配
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button
                                class="search-btn"
                                style="position: relative; right: 0; float: right"
                                @click="consumeConfig(0)"
                                >消耗配置
                            </el-button>
                            <el-button
                                class="search-btn"
                                type="primary"
                                style="position: relative; right: 0; float: right"
                                @click="infoData()"
                                >查看明细
                            </el-button>
                        </div>
                    </div>
                    <div class="info-content1" v-if="isCurSchoolType == 1">
                        <div class="info-list">
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >AI课堂分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[0]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[0]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >赛课辅导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[1]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[1]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                        </div>
                        <span
                            style="
                                display: flex;
                                float: left;
                                height: 38px;
                                line-height: 42px;
                                margin-left: 30px;
                                border-right: 2px solid #aaaaaa;
                            "
                        >
                        </span>
                        <div class="info-list">
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >大单元分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[2]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[2]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                            <div class="info-item">
                                <span style="margin-left: 20px"
                                    >AI课前指导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) + '次' }}</span
                                    ></span
                                >
                                <span style="margin-left: 20px; border-left: 2px solid #d7d7d7"></span>
                                <span style="margin-left: 20px"
                                    >已分配：{{ $comjs.formatValue(frequency[3]?.allocatedNum) + '次' }}</span
                                >
                                <span style="margin-left: 20px; padding-right: 10px; color: #70b603" class="bold-text"
                                    >待分配：{{ $comjs.formatValue(frequency[3]?.waitAllocatedNum) + '次' }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="info-content2" v-else>
                        <div class="info-list">
                            <div class="info-item">
                                <span
                                    >AI课堂分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) + '次' }}</span
                                    ></span
                                >
                            </div>
                            <div class="info-item">
                                <span
                                    >大单元分析 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) + '次' }}</span
                                    ></span
                                >
                            </div>
                            <div class="info-item">
                                <span
                                    >赛课辅导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) + '次' }}</span
                                    ></span
                                >
                            </div>
                            <div class="info-item">
                                <span
                                    >AI课前指导 -
                                    <span style="color: #f59a23" class="bold-text"
                                        >剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) + '次' }}</span
                                    ></span
                                >
                            </div>
                        </div>
                    </div>
                    <div
                        class="data-table table-border"
                        style="min-width: 1260px; overflow-y: auto; overflow-x: auto"
                        v-if="isCurSchoolType == 1"
                    >
                        <el-table
                            v-loading="loading"
                            :row-style="{height: '10px'}"
                            :cell-style="{padding: '12px 0'}"
                            :data="tableData"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="45"> </el-table-column>
                            <el-table-column prop="code" align="center" label="编号" width="105"></el-table-column>
                            <el-table-column
                                prop="teacherName"
                                align="center"
                                label="教师"
                                width="100"
                            ></el-table-column>
                            <el-table-column prop="statusName" align="center" label="状态" width="70"></el-table-column>
                            <el-table-column prop="orgName" align="center" label="所属机构"></el-table-column>
                            <el-table-column align="center" label="AI课堂分析" width="110">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['aiClassRemain'] }}/{{ scope.row['aiClassTotal'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="大单元及学情分析" width="140">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['bigUnitRemain'] }}/{{ scope.row['bigUnitTotal'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="赛课辅导" width="110">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['contestRemain'] }}/{{ scope.row['contestTotal'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="AI课前指导" width="110">
                                <template slot-scope="scope">
                                    <p>{{ scope.row['preClassRemain'] }}/{{ scope.row['preClassTotal'] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="160">
                                <template slot-scope="scope">
                                    <ul class="operat-list">
                                        <el-button type="text" @click="showQuotaAllocationDlg(scope.row)"
                                            >额度分配</el-button
                                        >
                                        <el-button type="text" @click="infoData(scope.row)">查看明细</el-button>
                                    </ul>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table-page" v-if="isCurSchoolType == 1">
                        <el-pagination
                            layout="prev, pager, next"
                            @current-change="pageChange"
                            :page-count="pages"
                            :current-page="pageNum"
                        >
                        </el-pagination>
                    </div>
                    <div class="table-null" v-else>
                        <div class="null-data">
                            <img src="@/assets/imgs/home-null.png" alt="" />
                            <p>该项目为学校公用，无需分配到个人账号</p>
                        </div>
                    </div>
                </div>
                <el-dialog
                    title="查看明细"
                    :close-on-click-modal="false"
                    :visible.sync="infoShow"
                    width="1320px"
                    @close="infoCancel()"
                >
                    <hr class="info-line" />
                    <div>
                        <span class="search-desc" v-if="isCurSchoolType == 0">使用人</span>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="detailInfo.teacherIdList"
                            placeholder="选择教师"
                            class="width-2"
                            filterable
                            remote
                            clearable
                            :remote-method="getTeacherList"
                            @clear="getTeacherList"
                            multiple
                            collapse-tags
                            v-if="isCurSchoolType == 0"
                        >
                            <el-option
                                v-for="item in teacherList"
                                :key="item.userId"
                                :label="item.name + (item.schoolName ? '-' + item.schoolName : '') + '-' + item.code"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                        <span class="search-desc">产品名称</span>
                        <el-select
                            v-model="detailInfo.productIdList"
                            placeholder="选择产品名称"
                            style="width: 240px"
                            multiple
                            collapse-tags
                            clearable
                        >
                            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <span class="search-desc">变动时间</span>
                        <el-date-picker
                            v-model="detailInfo.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                        <el-button type="primary" class="search-btn" @click="infoSearch()">查询</el-button>
                    </div>
                    <div class="table-list">
                        <el-table
                            :row-style="{height: '10px'}"
                            :cell-style="{padding: '12px 0'}"
                            v-loading="loading"
                            :data="infoTableData"
                            style="width: 100%"
                        >
                            <el-table-column align="center" prop="productName" label="产品名称"></el-table-column>
                            <el-table-column align="center" prop="operateType" label="关联事项"> </el-table-column>
                            <el-table-column align="center" prop="orgName" label="使用人" v-if="isCurSchoolType == 0">
                            </el-table-column>
                            <el-table-column align="center" prop="remark" label="备注" width="238px">
                                <template #default="scoped">
                                    <el-tooltip
                                        v-if="scoped.row.remark?.replace(/\s+/g, '').length > 15"
                                        :content="scoped.row.remark"
                                        placement="top"
                                    >
                                        <span
                                            style="
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;
                                                -webkit-line-clamp: 1;
                                                -webkit-box-orient: vertical;
                                                white-space: nowrap;
                                                max-width: 320px;
                                                word-break: break-word;
                                            "
                                        >
                                            {{ scoped.row.remark }}
                                        </span>
                                    </el-tooltip>
                                    <span v-else>{{ scoped.row.remark }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="createDate"
                                label="变动时间"
                                width="160px"
                            ></el-table-column>
                            <el-table-column align="center" prop="operateNum" label="变动数值" width="100px">
                                <template slot-scope="scope">
                                    <span :style="{color: scope.row.operateNum >= 0 ? 'green' : 'red'}">{{
                                        scope.row.operateNum >= 0 ? '+' + scope.row.operateNum : scope.row.operateNum
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="afterBalance" label="分析剩余次数"></el-table-column>
                        </el-table>
                    </div>
                    <div class="table-page">
                        <el-pagination
                            layout="prev, pager, next"
                            @current-change="infoPageChange"
                            :page-count="infoPage"
                            :current-page="infoPageNum"
                        >
                        </el-pagination>
                    </div>
                </el-dialog>
                <el-dialog
                    title="消耗配置"
                    :close-on-click-modal="false"
                    :visible.sync="configShow"
                    width="555px"
                    @close="consumeConfig(2)"
                >
                    <div>
                        <em class="prefix">*</em>
                        <span style="color: #000000; font-weight: bold"> 消耗配置：</span>
                        <template>
                            <el-radio style="margin-left: 40px" v-model="expendType" :label="0">学校公用</el-radio>
                            <el-radio v-model="expendType" :label="1">个人账号消耗</el-radio>
                        </template>
                        <p class="promptTwo">注：配置不同消耗方式，将会影响AI课堂分析，大单元分析 学校份额使用规则；</p>
                        <p class="promptColor">学校公用：所有账号公用学校池的AI分析产品次数；</p>
                        <p class="promptColor">个人账号消耗：需从学校池再分配至个人账号后才可使用；</p>
                        <div class="button-list">
                            <el-button style="margin-right: 20px" @click="consumeConfig(2)">取消</el-button>
                            <el-button type="primary" @click="consumeConfig(1, curRow)">确定</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                    title="修改配置"
                    :close-on-click-modal="false"
                    :visible.sync="configConfirmShow"
                    width="540px"
                    @close="cancelConfig()"
                >
                    <!-- 公用改为个人 -->
                    <div v-if="isPublic === 0 && expendType === 1">
                        <p class="revise">确定要修改消耗配置吗？修改后需要给教师账号分配AI分析次数后才可使用！</p>
                    </div>
                    <!-- 个人改为公用 -->
                    <div v-if="isPublic === 1 && expendType === 0">
                        <p class="revise">确定要修改消耗配置吗？一旦修改，原本账号关联的AI分析次数将会被回收！</p>
                    </div>
                    <div class="button-list">
                        <el-button style="margin-right: 20px" @click="cancelConfig()">取消</el-button>
                        <el-button type="primary" @click="configConfirm()">确定</el-button>
                    </div>
                </el-dialog>
                <el-dialog
                    title="批量分配"
                    :close-on-click-modal="false"
                    :visible.sync="batchShow"
                    width="1400px"
                    @close="batchCancel()"
                >
                    <hr class="batch-line" />
                    <div class="batch-dialog-wrap">
                        <div class="info-content-dlg">
                            <div class="info-item">
                                AI课堂分析剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                大单元及学情分析剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                赛课辅导剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) }}次
                            </div>
                            <div class="info-item">
                                AI课前指导剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) }}次
                            </div>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title">所属项目</p>
                            <p>{{ $route.query.projectName }}</p>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>产品名称</p>
                            <el-select v-model="batchInfo.productId">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="batch-data">
                            <p class="dialog-title"><em>*</em>分配账号</p>
                            <el-table
                                :row-style="{height: '10px'}"
                                :cell-style="{padding: '12px 0'}"
                                v-loading="loading"
                                :data="batchTableData"
                                style="width: 100%"
                            >
                                <el-table-column prop="code" align="center" label="编号" width="105"></el-table-column>
                                <el-table-column
                                    prop="teacherName"
                                    align="center"
                                    label="教师"
                                    width="100"
                                ></el-table-column>
                                <el-table-column
                                    prop="statusName"
                                    align="center"
                                    label="状态"
                                    width="70"
                                ></el-table-column>
                                <el-table-column prop="orgName" align="center" label="所属机构"></el-table-column>
                                <el-table-column align="center" label="AI课堂分析" width="110">
                                    <template slot-scope="scope">
                                        <p style="text-align: center">
                                            {{ scope.row['aiClassRemain'] }}/{{ scope.row['aiClassTotal'] }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="大单元及学情分析" width="140">
                                    <template slot-scope="scope">
                                        <p style="text-align: center">
                                            {{ scope.row['bigUnitRemain'] }}/{{ scope.row['bigUnitTotal'] }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="赛课辅导" width="100">
                                    <template slot-scope="scope">
                                        <p style="text-align: center">
                                            {{ scope.row['contestRemain'] }}/{{ scope.row['contestTotal'] }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="AI课前指导" width="110">
                                    <template slot-scope="scope">
                                        <p style="text-align: center">
                                            {{ scope.row['preClassRemain'] }}/{{ scope.row['preClassTotal'] }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="allocateNum">
                                    <template slot="header">
                                        <span>分配次数</span>
                                        <el-tooltip placement="top">
                                            <div slot="content">
                                                正数：账号新增对应数值的AI分析次数；<br />
                                                负数：账号减少对应数值的AI分析次数；
                                            </div>
                                            <i
                                                class="iconfont icon-wenhao"
                                                style="margin-left: 10px; color: #000000"
                                            ></i>
                                        </el-tooltip>
                                    </template>
                                    <template #default="scoped">
                                        <el-input-number
                                            class="batch-num"
                                            :precision="0"
                                            v-model="scoped.row.allocateNum"
                                            @blur="blurNumber"
                                        ></el-input-number>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <p class="batch-prompt">注：分配次数将从项目账户进行扣除</p>
                        <div class="dialog-item">
                            <p>备注</p>
                            <el-input
                                type="textarea"
                                :rows="4"
                                placeholder=""
                                maxlength="200"
                                show-word-limit
                                class="batch-upload-wrap"
                                v-model="batchInfo.remark"
                            ></el-input>
                        </div>
                        <div class="batch-btn-list">
                            <el-button class="confirm" type="primary" @click="batchConfirm()">确定</el-button>
                            <el-button class="cancel" @click="batchCancel()">取消</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                    title="额度分配"
                    :close-on-click-modal="false"
                    :visible.sync="isShowQuotaAllocation"
                    width="850px"
                    @close="quotaAllocation(2)"
                >
                    <hr class="line" />
                    <div class="quota-dialog-wrap">
                        <div class="dialog-item">
                            <p>教师</p>
                            <p>{{ curRow.teacherName }}-{{ curRow.code }}</p>
                        </div>
                        <div class="dialog-item tip-item">
                            <p></p>
                            <div class="info-item">
                                AI课堂分析剩余：{{ $comjs.formatValue(frequency[0]?.remainNum) }}次，
                            </div>
                            <div class="info-item">
                                大单元及学情分析剩余：{{ $comjs.formatValue(frequency[2]?.remainNum) }}次，
                            </div>
                            <div class="info-item">
                                赛课辅导剩余：{{ $comjs.formatValue(frequency[1]?.remainNum) }}次，
                            </div>
                            <div class="info-item">
                                AI课前指导剩余：{{ $comjs.formatValue(frequency[3]?.remainNum) }}次
                            </div>
                        </div>
                        <div class="dialog-item">
                            <p>所属项目</p>
                            <p>{{ $route.query.projectName }}</p>
                        </div>
                        <div class="dialog-item tip-item">
                            <p></p>
                            <div class="info-item">
                                AI课堂分析可分配：{{ $comjs.formatValue(frequency[0]?.waitAllocatedNum) }}次，
                            </div>
                            <div class="info-item">
                                大单元及学情分析可分配：{{ $comjs.formatValue(frequency[2]?.waitAllocatedNum) }}次，
                            </div>
                            <div class="info-item">
                                赛课辅导可分配：{{ $comjs.formatValue(frequency[1]?.waitAllocatedNum) }}次，
                            </div>
                            <div class="info-item">
                                AI课前指导可分配：{{ $comjs.formatValue(frequency[3]?.waitAllocatedNum) }}次
                            </div>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>产品名称：</p>
                            <el-select v-model="quotaInfo.productId">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title"><em>*</em>分析次数：</p>
                            <el-input-number
                                class="width-6x"
                                :precision="0"
                                v-model="quotaInfo.num"
                                @blur="blurNumber"
                            ></el-input-number>
                            <el-tooltip placement="top">
                                <div slot="content">
                                    正整数：将所选分析池增加对应的AI分析次数；<br />负整数：将所选分析池减少对应的AI分析次数；
                                </div>
                                <i class="iconfont icon-wenhao" style="margin-left: 10px; color: #000000"></i>
                            </el-tooltip>
                        </div>
                        <div class="dialog-item">
                            <p class="dialog-title">备注：</p>
                            <el-input
                                type="textarea"
                                :rows="4"
                                placeholder=""
                                maxlength="200"
                                show-word-limit
                                class="upload-wrap"
                                v-model="quotaInfo.remark"
                            ></el-input>
                        </div>
                        <div class="btn-list">
                            <el-button class="confirm" type="primary" @click="quotaAllocation(1)">确定</el-button>
                            <el-button class="cancel" @click="quotaAllocation(2)">取消</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            productList: [],
            curRow: {},
            orgId: '',
            frequency: [],
            infoShow: false,
            infoSearchKey: '', // 分配明细搜索关键词
            infoProductIdList: [],
            infoPageNum: 1,
            infoPage: 0,
            infoTotal: '',
            infoTableData: [], // 明细列表数据
            isShowQuotaAllocation: false,
            quotaInfo: {},
            configShow: false,
            configRow: {},
            configNum: 0,
            configConfirmShow: false,
            teacherList: [],
            expendType: 0, // 0公用
            isPublic: 0,
            isCurSchoolType: 0,
            keyWord: '',
            statusList: [
                {value: '', label: '全部'},
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            status: '',
            tableData: [],
            pageNum: 1,
            pages: 0,
            batchShow: false, // 批量分配弹窗
            batchTableData: [], // 批量分配列表数据
            batchConfirmData: [], // 批量分配确定数据
            batchProducts: 1, // 批量分配弹窗调整产品默认选中数据
            batchOptions: [
                {
                    value: 1,
                    label: 'AI课堂分析（教师版&专业版）',
                },
                {
                    value: 2,
                    label: '大单元分析',
                },
            ], // 批量分配弹窗调整产品选择项
            batchRemark: '', // 批量分配备注
            detailInfo: {},
            batchInfo: {},
        };
    },
    activated() {
        this.keyWord = '';
        this.pageNum = 1;
        this.pages = 0;
        this.status = '';
        this.getTotal();
        this.getSchoolType();
    },
    methods: {
        getSchoolType() {
            this.$axios
                .get('/aiAnalysisAllocation/allocation/getConsumeMode', {
                    orgId: this.$route.query.orgId,
                    projectId: this.$route.query.id,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.isCurSchoolType = res.data;
                        if (res.data == 1) {
                            this.getList();
                        }
                    }
                });
        },
        getList() {
            let params = {};
            params['projectId'] = this.$route.query.id;
            params['orgId'] = this.$route.query.orgId;
            params['keyWord'] = this.keyWord;
            params['status'] = this.status;
            params['allocateType'] = this.keyWord ? 1 : 0;
            params['pageNum'] = this.pageNum;
            params['pageSize'] = 10;
            this.loading = true;
            this.$axios.post('/aiAnalysisAllocation/allocation/personalList', params).then((res) => {
                if (res.code == 200) {
                    this.loading = false;
                    this.tableData = res.data.pageList;
                    this.pages = res.data.pages;
                }
            });
        },
        // 列表搜索
        search() {
            this.pageNum = 1;
            this.getList();
            this.getTotal();
        },
        // 获取分析池总计数据 data 查询参数
        getTotal() {
            let params = {};
            params['orgId'] = this.$route.query.orgId;
            params['projectId'] = this.$route.query.id;
            params['allocateType'] = this.keyWord ? 1 : 0;
            this.$axios.post('/aiAnalysisAllocation/allocation/topStat', params).then((res) => {
                if (res.code == 200) {
                    this.frequency = res.data;
                }
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/aiAnalysisAllocation');
            } else {
                this.$router.go(-1);
            }
        },
        // 获取产品下拉
        getProductList() {
            this.$axios.get('/aiAnalysisStock/listAll').then((res) => {
                if (res.code == 200) {
                    this.productList = res.data;
                }
            });
        },
        // 查看分配明细
        infoData(row) {
            this.infoShow = true;
            this.getProductList();
            let params = {};
            params['productIdList'] = this.detailInfo.productIdList;
            params['pageNum'] = this.infoPageNum;
            params['pageSize'] = 10;
            params['startTime'] = this.detailInfo.time ? this.detailInfo.time[0] : '';
            params['endTime'] = this.detailInfo.time ? this.detailInfo.time[1] : '';
            params['projectId'] = this.$route.query.id;

            if (row) {
                params['teacherIdList'] = [row.teacherId];
                params['orgId'] = '';
                params['flag'] = 0;
            } else {
                params['teacherIdList'] = this.detailInfo.teacherIdList;
                params['orgId'] = this.$route.query.orgId;
                params['flag'] = 1;
            }
            this.$axios.post('/aiAnalysisAllocation/allocation/logList', params).then((res) => {
                if (res.code === 200) {
                    this.loading = false;
                    this.infoTableData = res.data.pageList;
                    this.infoPage = res.data.pages;
                    this.infoTotal = res.data.total;
                }
            });
        },
        // 查看明细取消
        infoCancel() {
            this.detailInfo = {};
            this.infoPageNum = 1;
        },
        // 查看明细搜索
        infoSearch() {
            this.infoPageNum = 1;
            this.infoData();
        },
        // 明细页分页点击
        infoPageChange(val) {
            this.infoPageNum = val;
            this.infoData();
        },
        // 额度分配 0分配弹窗 1确认分配 2取消分配
        quotaAllocation(type) {
            if (type == 1) {
                // 确认分配
                if (this.verify()) {
                    return;
                }
                this.$axios.post('/aiAnalysisAllocation/allocation/schoolDoAllocate', this.quotaInfo).then((res) => {
                    if (res.code == 200) {
                        this.isShowQuotaAllocation = false;
                        this.getList();
                        this.getTotal();
                        this.$message('额度分配成功！', 'success');
                    } else {
                        this.$message(res.message, 'error');
                    }
                });
            } else {
                this.isShowQuotaAllocation = false;
            }
        },
        showQuotaAllocationDlg(row) {
            this.curRow = JSON.parse(JSON.stringify(row));
            this.isShowQuotaAllocation = true;
            this.quotaInfo = {};
            this.quotaInfo['projectId'] = this.$route.query.id;
            this.quotaInfo['eduOrgId'] = this.$route.query.orgId;
            this.quotaInfo['orgId'] = this.curRow.teacherId;
            this.quotaInfo['allocateType'] = 1;
            this.getProductList();
        },
        // 验证
        verify() {
            if (this.quotaInfo.num == 0) {
                this.$message('次数不能为0！', 'error');
                return true;
            }
            if (!this.quotaInfo.productId) {
                this.$message('产品名称不能为空！', 'error');
                return true;
            }
            if (this.quotaInfo.remark) {
                let stringLength = this.quotaInfo.remark.replace(/\s+/g, '');
                if (stringLength.length > 200) {
                    this.$message('备注内容不得超过200字！', 'error');
                    return true;
                }
            }
        },
        blurNumber(e) {
            if (!e.target.value) {
                e.target.value = 0;
            }
        },
        // 消耗配置
        consumeConfig(type, val) {
            if (type == 0) {
                this.$axios
                    .get('/aiAnalysisAllocation/allocation/getConsumeMode', {
                        orgId: this.$route.query.orgId,
                        projectId: this.$route.query.id,
                    })
                    .then((res) => {
                        if (res.code == 200) {
                            this.expendType = res.data;
                            this.isPublic = res.data;
                            this.configShow = true;
                        }
                    });
            } else if (type == 1) {
                if ((this.isPublic === 0 && this.expendType === 1) || (this.isPublic === 1 && this.expendType === 0)) {
                    this.configConfirmShow = true;
                } else {
                    this.configShow = false;
                    this.$message('更新成功', 'success');
                }
            } else {
                this.configShow = false;
            }
        },
        // 确认消耗配置——取消事件
        cancelConfig() {
            this.configConfirmShow = false;
        },
        // 确认消耗配置——确定事件
        configConfirm() {
            let params = {};
            params['expendType'] = this.expendType;
            params['orgId'] = this.$route.query.orgId;
            params['projectId'] = this.$route.query.id;
            this.$axios.get('/aiAnalysisAllocation/allocation/changeExpendType', params).then((res) => {
                if (res.code == 200) {
                    this.configConfirmShow = false;
                    this.configShow = false;
                    this.isCurSchoolType = this.expendType;
                    this.getTotal();
                    if (this.isCurSchoolType == 1) {
                        this.getList();
                    }
                    this.$message('更新成功', 'success');
                } else {
                    this.$message(res.message, 'error');
                }
            });
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
        // 列表分页点击
        pageChange(val) {
            this.pageNum = val;
            this.getList();
        },
        // 批量分配取消
        batchCancel() {
            this.batchShow = false;
            this.batchProducts = 1;
            this.batchRemark = '';
            this.batchInfo = {};
            this.batchTableData = this.batchTableData.map((item) => ({
                ...item,
                allocateNum: 1,
            }));
        },
        batchData() {
            if (this.batchTableData.length == 0) {
                this.$message('请选择编号！', 'error');
                return;
            }
            this.getProductList();
            this.batchTableData = this.batchTableData.map((item) => ({
                ...item,
                allocateNum: 1,
            }));
            this.batchShow = true;
        },
        handleSelectionChange(val) {
            this.batchTableData = JSON.parse(JSON.stringify(val));
        },
        batchConfirm() {
            if (!this.batchInfo.productId) {
                this.$message('产品名称不能为空！', 'error');
                return;
            }
            let teacherList = [];
            for (let i = 0; i < this.batchTableData.length; i++) {
                if (!this.batchTableData[i].allocateNum) {
                    this.$message('分配次数不能为0！', 'error');
                    return;
                }
                console.log(this.batchTableData[i].teacherId);
                let item = {};
                item['teacherId'] = this.batchTableData[i].teacherId;
                item['allocateNum'] = this.batchTableData[i].allocateNum;
                teacherList.push(item);
            }
            this.batchInfo['projectId'] = this.$route.query.id;
            this.batchInfo['orgId'] = this.$route.query.orgId;
            this.batchInfo['teacherList'] = teacherList;
            this.batchInfo['allocateType'] = 1;
            this.$axios.post('/aiAnalysisAllocation/allocation/batchAllocate', this.batchInfo).then((res) => {
                if (res.code == 200) {
                    this.$message('分配成功！', 'success');
                    this.batchCancel();
                } else {
                    this.$message(res.message, 'error');
                }
            });
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.main-wrap {
    padding-bottom: 35px;

    .table-null {
        margin-top: 20px;
        padding: 0 24px;
        border: 1px solid #ebebeb;
        height: 400px;

        .null-data {
            width: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;

            img {
                padding-top: 80px;
                width: 560px;
                height: 240px;
            }

            p {
                margin-top: 20px;
                margin-bottom: 20px;
                text-align: center;
                color: rgb(117, 112, 112);
                font-size: 18px;
                font-weight: 700;
            }
        }
    }
}
.content-overflow {
    overflow-y: auto;
    overflow-x: auto;
    height: 100%;
    width: 100%;
    min-width: 1260px;

    .info-content1 {
        width: 100%;
        min-width: 1260px;
        overflow-x: auto;
        height: 100px;
        align-items: center;
        display: flex;
        margin-top: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
        display: flex;

        .info-list {
            width: 49%;

            .bold-text {
                font-weight: 700;
            }

            .info-item {
                height: 38px;
                line-height: 42px;
            }
        }
    }

    .info-content2 {
        width: 100%;
        min-width: 1260px;
        overflow-x: auto;
        height: 50px;
        align-items: center;
        margin-top: 50px;
        background-color: #f9f9f9;
        border-radius: 5px;

        .info-list {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
            height: 100%;
            text-align: left;

            .bold-text {
                font-weight: 700;
            }

            .info-item {
                width: 25%;
                height: 38px;
                line-height: 42px;
            }
        }
    }
}
.operat-list {
    color: #409eff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.search-operat-new {
    width: 100%;
}

.button {
    float: right;
    margin-top: 2px;
}

.info-line {
    margin-top: 0px;
    margin-bottom: 20px;
    width: 1265px;
}

.line {
    margin-top: -30px;
    margin-bottom: 20px;
    width: 545px;
}

.table-list {
    padding: 0 24px;
    border: 1px solid #ebebeb;
    margin-top: 20px;
    width: 1210px;
}

.upload-wrap {
    height: 80px;
    width: 282px;
    color: #808285;
}

.prompt {
    margin: 10px 0;
    color: gray;
}

.promptTwo {
    margin-top: 40px;
    margin-bottom: 20px;
    color: gray;
}

.prefix {
    color: red;
}

.width-6x {
    width: 180px;
}

.remark {
    display: flex;
    height: 80px;
}

.left {
    align-content: center;
    height: 80px;
    margin-left: 33px;
    font-weight: bold;
    color: #808285;
}

.btn-list {
    margin-top: 40px;
    margin-left: 100px;
}

.confirm {
    width: 100px;
    height: 40px;
}

.cancel {
    width: 100px;
    height: 40px;
    margin-left: 20px;
}

.promptColor {
    color: gray;
}

.button-list {
    margin-top: 40px;
    text-align: right;
}

.revise {
    color: red;
}
.batch-dialog-wrap {
    color: #202020;

    .info-content-dlg {
        display: flex;
        background-color: #f9f9f9;
        padding: 10px;
        flex-wrap: wrap;

        .info-item {
            width: 24%;
        }
        p {
            color: #bdbdbd;
            font-size: 12px;
        }
    }
    .dialog-item {
        margin-top: 15px;
        margin-bottom: 0;
        align-items: center;

        p:first-child {
            text-align: right;
            width: 80px;
            margin-right: 20px;
        }
    }
    .batch-data {
        display: flex;

        p:first-child {
            text-align: right;
            width: 80px;
            margin-right: 20px;
            padding-top: 15px;
        }
        em {
            color: #f64646;
        }
    }
    .batch-prompt {
        color: #bdbdbd;
        margin-left: 100px;
    }
    .batch-upload-wrap {
        height: 80px;
        width: 374px;
    }
    .batch-btn-list {
        margin-top: 30px;
        text-align: center;
    }
}
.quota-dialog-wrap {
    color: #202020;

    .info-content-dlg {
        display: flex;
        background-color: #f9f9f9;

        flex-wrap: wrap;
        padding-left: 20px;

        .info-item {
            width: 40%;
            margin-right: 20px;
            margin-top: 15px;
        }
        p {
            color: #bdbdbd;
            font-size: 12px;
        }
    }
    .dialog-item {
        margin-top: 15px;
        margin-bottom: 0;
        align-items: center;

        p:first-child {
            text-align: right;
            width: 80px;
            margin-right: 20px;
        }
    }
    .tip-item {
        margin-top: -15px;
        color: #979797;
    }
}
</style>

<style scoped>
::v-deep .el-dialog__header {
    padding: 20px 30px 10px;
}

::v-deep .el-dialog__body {
    padding: 30px 30px;
    font-size: 14px;
    color: white;
}

::v-deep .el-dialog__wrapper {
    left: 180px;
}
</style>
<style lang="scss">
.el-tooltip__popper.is-dark {
    max-width: 260px;
}
</style>

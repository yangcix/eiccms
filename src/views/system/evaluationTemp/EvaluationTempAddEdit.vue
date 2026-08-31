<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.tepmid ? '编辑' : '新增'}评课模板页`"
            ></el-page-header>
        </p>
        <div class="content-wrap" v-show="isShowFirstPage">
            <div
                class="item-wrap"
                style="
                    position: fixed;
                    background-color: #ffffff;
                    margin: 0;
                    z-index: 99;
                    padding: 16px 30px;
                    border: 1px solid #dcdfe6;
                    width: 800px;
                "
            >
                <p style="width: 160px">评价操作栏：</p>
                <span class="add-assistant notselect" @click="addAssistant(1)"
                    ><i class="el-icon-plus"></i> 分数评价项</span
                >
                <span class="add-assistant notselect" @click="addAssistant(2)"
                    ><i class="el-icon-plus"></i> 文字评价项</span
                >
                <span class="add-assistant notselect" style="width: 200px" @click="addAssistant(3)"
                    ><i class="el-icon-plus"></i> 分数及文字评价项</span
                >
                <span class="add-assistant notselect" style="width: 160px" @click="openShowDialog()"
                    ><i class="el-icon-plus"></i> 总结性评价项</span
                >
                <span class="add-assistant notselect" @click="openPreview()"> 表格效果查看</span>
            </div>
            <div class="item-scroll">
                <div class="box">
                    <div class="item-wrap">
                        <p>模板名称</p>
                        <p><em>*</em>：</p>
                        <el-input
                            :class="form.name == true ? 'width-2 has-error' : 'width-2'"
                            v-model.trim="addEditInfo.name"
                            clearable
                            @focus="clarnHas(1)"
                        ></el-input>
                    </div>
                    <div class="item-wrap">
                        <p>评价项备注</p>
                        <p><em style="opacity: 0">*</em>：</p>
                        <el-radio v-model="addEditInfo.isOpenRemarks" :label="1">是</el-radio>
                        <el-radio v-model="addEditInfo.isOpenRemarks" :label="0">否</el-radio>
                        <p v-show="addEditInfo.isOpenRemarks == 1" class="specialp">备注项名称：</p>
                        <el-input
                            v-show="addEditInfo.isOpenRemarks == 1"
                            :class="form.remarksName == true ? 'width-2 has-error' : 'width-2'"
                            @focus="clarnHas(2)"
                            v-model="addEditInfo.remarksName"
                            clearable
                        ></el-input>
                        <p class="specialp"><em>*</em>评分备注项将在各评分项后增加备注说明框</p>
                    </div>
                    <div class="item-wrap">
                        <p>评课评价项</p>
                        <p><em>*</em>：</p>
                        <p class="usetemplate" @click="useTemp" v-if="!currentTemp">引用模板</p>
                        <el-tag closable style="margin-left: 10px" v-else @close="handleClose">{{
                            currentTemp
                        }}</el-tag>
                        <span v-show="itemList[0] && (itemList[0].type == 0 || itemList[0].type == 2)" class="total"
                            >总分:{{ addEditInfo.score ? addEditInfo.score : 0 }}</span
                        >
                    </div>
                    <!-- <p style="margin-top: 10px;font-size: 18px;font-weight: 600;">分数评价项：</p> -->
                    <div class="special" v-for="(val, index) in itemList" :key="index">
                        <div v-if="val.type == 0">
                            <div class="item-wrap-one">
                                <p class="input-s">评分一级项目{{ index + 1 }}</p>
                                <div
                                    :class="val.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                    @click="handleOpen(val.show, index)"
                                ></div>
                                <p><em>*</em>：</p>
                                <el-input
                                    :class="
                                        form.itemList &&
                                        form.itemList[index] &&
                                        form.itemList[index].hasError &&
                                        form.itemList[index].hasError == true
                                            ? 'width-10 has-error'
                                            : 'width-10'
                                    "
                                    @focus="clarnHas(3, index)"
                                    v-model="val.item"
                                    clearable
                                ></el-input>
                                <p v-if="val.children && val.children.length == 0" class="input-s score">分数</p>
                                <p v-if="val.children && val.children.length == 0"><em>*</em>：</p>
                                <el-input-number
                                    v-if="val.children && val.children.length == 0"
                                    class="width-6x"
                                    :precision="0"
                                    v-model="val.score"
                                    @blur="blurNumber"
                                    @change="changeScore()"
                                    :min="1"
                                    :max="100"
                                ></el-input-number>
                                <p v-if="val.children && val.children.length > 0" class="input-s score">
                                    合计：{{ val.total }}
                                </p>
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistant(0, index)"
                                    >删除评价项</span
                                >
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistants(1, index)"
                                    >添加二级评价项</span
                                >
                            </div>
                            <div v-show="val.children && val.children.length > 0 && val.show == 1">
                                <div v-for="(vals, indexs) in val.children" :key="indexs">
                                    <div class="item-wrap-children">
                                        <p class="input-s">评分二级项目{{ indexs + 1 }}</p>
                                        <div
                                            :class="vals.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                            @click="handleOpens(vals.show, index, indexs)"
                                        ></div>
                                        <p><em>*</em>：</p>
                                        <el-input
                                            :class="
                                                form.itemList &&
                                                form.itemList[index] &&
                                                form.itemList[index].children[indexs].hasError == true
                                                    ? 'width-10 has-error'
                                                    : 'width-10'
                                            "
                                            @focus="clarnHas(4, index, indexs)"
                                            v-model="vals.item"
                                            clearable
                                            type="textarea"
                                            :autosize="{minRows: 2, maxRows: 4}"
                                            maxlength="1000"
                                        ></el-input>
                                        <p v-if="vals.children && vals.children.length == 0" class="input-s score">
                                            分数
                                        </p>
                                        <p v-if="vals.children && vals.children.length == 0"><em>*</em>：</p>
                                        <el-input-number
                                            v-if="vals.children && vals.children.length == 0"
                                            class="width-6x"
                                            :precision="0"
                                            v-model="vals.score"
                                            @blur="blurNumber"
                                            @change="changeScore()"
                                            clearable
                                            :min="1"
                                            :max="100"
                                            label="描述文字"
                                        ></el-input-number>
                                        <p v-if="vals.children && vals.children.length > 0" class="input-s score">
                                            合计：{{ vals.total }}
                                        </p>
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addAssistants(0, index, indexs)"
                                            >删除评价项</span
                                        >
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addsAssistants(1, index, indexs)"
                                            >添加三级评价项</span
                                        >
                                    </div>

                                    <div v-show="vals.children && vals.children.length > 0 && vals.show == 1">
                                        <div
                                            v-for="(valss, indexss) in vals.children"
                                            :key="indexss"
                                            class="item-wrap-children"
                                            style="padding-left: 60px"
                                        >
                                            <p class="input-s" style="margin-left: 18px">
                                                评分三级项目{{ indexss + 1 }}
                                            </p>
                                            <p><em>*</em>：</p>
                                            <el-input
                                                :class="
                                                    form.itemList &&
                                                    form.itemList[index] &&
                                                    form.itemList[index].children[indexs].children[indexss].hasError ==
                                                        true
                                                        ? 'width-10 has-error'
                                                        : 'width-10'
                                                "
                                                @focus="clarnHas(5, index, indexs, indexss)"
                                                v-model="valss.item"
                                                clearable
                                                type="textarea"
                                                :autosize="{minRows: 2, maxRows: 4}"
                                                maxlength="1000"
                                            ></el-input>
                                            <p class="input-s score">分数</p>
                                            <p><em>*</em>：</p>
                                            <el-input-number
                                                class="width-6x"
                                                v-model="valss.score"
                                                @blur="blurNumber"
                                                @change="changeScore()"
                                                :precision="0"
                                                clearable
                                                :min="1"
                                                :max="100"
                                                label="描述文字"
                                            ></el-input-number>
                                            <span
                                                class="del-btn notselect"
                                                style="margin-left: 35px"
                                                @click="addsAssistants(0, index, indexs, indexss)"
                                                >删除评价项</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="val.type == 1">
                            <div class="item-wrap-one">
                                <p class="input-s">文字一级项目{{ index + 1 }}</p>
                                <div
                                    :class="val.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                    @click="handleOpen(val.show, index)"
                                ></div>
                                <p><em>*</em>：</p>
                                <el-input
                                    :class="
                                        form.itemList && form.itemList[index] && form.itemList[index].hasError == true
                                            ? 'width-10 has-error'
                                            : 'width-10'
                                    "
                                    @focus="clarnHas(3, index)"
                                    v-model="val.item"
                                    clearable
                                ></el-input>
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistant(0, index)"
                                    >删除评价项</span
                                >
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistants(2, index)"
                                    >添加二级评价项</span
                                >
                            </div>
                            <div v-show="val.children && val.children.length > 0 && val.show == 1">
                                <div v-for="(vals, indexs) in val.children" :key="indexs">
                                    <div class="item-wrap-children">
                                        <p class="input-s">文字二级项目{{ indexs + 1 }}</p>
                                        <div
                                            :class="vals.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                            @click="handleOpens(vals.show, index, indexs)"
                                        ></div>
                                        <p><em>*</em>：</p>
                                        <el-input
                                            :class="
                                                form.itemList &&
                                                form.itemList[index] &&
                                                form.itemList[index].children[indexs].hasError == true
                                                    ? 'width-10 has-error'
                                                    : 'width-10'
                                            "
                                            @focus="clarnHas(4, index, indexs)"
                                            v-model="vals.item"
                                            clearable
                                        ></el-input>
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addAssistants(0, index, indexs)"
                                            >删除评价项</span
                                        >
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addsAssistants(2, index, indexs)"
                                            >添加三级评价项</span
                                        >
                                    </div>

                                    <div v-show="vals.children && vals.children.length > 0 && vals.show == 1">
                                        <div
                                            v-for="(valss, indexss) in vals.children"
                                            :key="indexss"
                                            class="item-wrap-children"
                                            style="padding-left: 60px"
                                        >
                                            <p class="input-s" style="margin-left: 18px">
                                                文字三级项目{{ indexss + 1 }}
                                            </p>
                                            <p><em>*</em>：</p>
                                            <el-input
                                                :class="
                                                    form.itemList &&
                                                    form.itemList[index] &&
                                                    form.itemList[index].children[indexs].children[indexss].hasError ==
                                                        true
                                                        ? 'width-10 has-error'
                                                        : 'width-10'
                                                "
                                                @focus="clarnHas(5, index, indexs, indexss)"
                                                v-model="valss.item"
                                                clearable
                                            ></el-input>
                                            <span
                                                class="del-btn notselect"
                                                style="margin-left: 35px"
                                                @click="addsAssistants(0, index, indexs, indexss)"
                                                >删除评价项</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="val.type == 2">
                            <div class="item-wrap-one">
                                <p class="input-s" style="width: 160px">分数及文字一级项目{{ index + 1 }}</p>
                                <div
                                    :class="val.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                    @click="handleOpen(val.show, index)"
                                ></div>
                                <p><em>*</em>：</p>
                                <el-input
                                    type="textarea"
                                    :class="
                                        form.itemList &&
                                        form.itemList[index] &&
                                        form.itemList[index].hasError &&
                                        form.itemList[index].hasError == true
                                            ? 'width-10 has-error'
                                            : 'width-10'
                                    "
                                    @focus="clarnHas(3, index)"
                                    v-model="val.item"
                                    clearable
                                ></el-input>
                                <p v-if="val.children && val.children.length == 0" class="input-s score">分数</p>
                                <p v-if="val.children && val.children.length == 0"><em>*</em>：</p>
                                <el-input-number
                                    v-if="val.children && val.children.length == 0"
                                    class="width-6x"
                                    :precision="0"
                                    v-model="val.score"
                                    @blur="blurNumber"
                                    @change="changeScore()"
                                    :min="1"
                                    :max="100"
                                ></el-input-number>
                                <p v-if="val.children && val.children.length > 0" class="input-s score">
                                    合计：{{ val.total }}
                                </p>
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistant(0, index)"
                                    >删除评价项</span
                                >
                                <span
                                    class="del-btn notselect"
                                    style="margin-left: 35px"
                                    @click="addAssistants(3, index)"
                                    >添加二级评价项</span
                                >
                            </div>
                            <div v-show="val.children && val.children.length > 0 && val.show == 1">
                                <div v-for="(vals, indexs) in val.children" :key="indexs">
                                    <div class="item-wrap-children">
                                        <p class="input-s" style="width: 160px">分数及文字二级项目{{ indexs + 1 }}</p>
                                        <div
                                            :class="vals.show == 1 ? 'buttonBottom' : 'buttonRight'"
                                            @click="handleOpens(vals.show, index, indexs)"
                                        ></div>
                                        <p><em>*</em>：</p>
                                        <el-input
                                            type="textarea"
                                            :class="
                                                form.itemList &&
                                                form.itemList[index] &&
                                                form.itemList[index].children[indexs].hasError == true
                                                    ? 'width-10 has-error'
                                                    : 'width-10'
                                            "
                                            @focus="clarnHas(4, index, indexs)"
                                            v-model="vals.item"
                                            clearable
                                        ></el-input>
                                        <p v-if="vals.children && vals.children.length == 0" class="input-s score">
                                            分数
                                        </p>
                                        <p v-if="vals.children && vals.children.length == 0"><em>*</em>：</p>
                                        <el-input-number
                                            v-if="vals.children && vals.children.length == 0"
                                            class="width-6x"
                                            :precision="0"
                                            v-model="vals.score"
                                            @blur="blurNumber"
                                            @change="changeScore()"
                                            clearable
                                            :min="1"
                                            :max="100"
                                            label="描述文字"
                                        ></el-input-number>
                                        <p v-if="vals.children && vals.children.length > 0" class="input-s score">
                                            合计：{{ vals.total }}
                                        </p>
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addAssistants(0, index, indexs)"
                                            >删除评价项</span
                                        >
                                        <span
                                            class="del-btn notselect"
                                            style="margin-left: 35px"
                                            @click="addsAssistants(3, index, indexs)"
                                            >添加三级评价项</span
                                        >
                                    </div>

                                    <div v-show="vals.children && vals.children.length > 0 && vals.show == 1">
                                        <div
                                            v-for="(valss, indexss) in vals.children"
                                            :key="indexss"
                                            class="item-wrap-children"
                                            style="padding-left: 60px"
                                        >
                                            <p class="input-s" style="margin-left: 18px; width: 160px">
                                                分数及文字三级项目{{ indexss + 1 }}
                                            </p>
                                            <p><em>*</em>：</p>
                                            <el-input
                                                :class="
                                                    form.itemList &&
                                                    form.itemList[index] &&
                                                    form.itemList[index].children[indexs].children[indexss].hasError ==
                                                        true
                                                        ? 'width-10 has-error'
                                                        : 'width-10'
                                                "
                                                @focus="clarnHas(5, index, indexs, indexss)"
                                                v-model="valss.item"
                                                clearable
                                            ></el-input>
                                            <p class="input-s score">分数</p>
                                            <p><em>*</em>：</p>
                                            <el-input-number
                                                class="width-6x"
                                                v-model="valss.score"
                                                @blur="blurNumber"
                                                @change="changeScore()"
                                                :precision="0"
                                                clearable
                                                :min="1"
                                                :max="100"
                                                label="描述文字"
                                            ></el-input-number>
                                            <span
                                                class="del-btn notselect"
                                                style="margin-left: 35px"
                                                @click="addsAssistants(0, index, indexs, indexss)"
                                                >删除评价项</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <i class="el-icon-remove-outline sub" @click="addAssistant(0, index)"></i> -->
                    </div>
                    <!-- <div v-if="itemLists.length > 0">
            <p style="margin-top: 10px;font-size: 18px;font-weight: 600;">文字评价项：</p>
          <div class="special" v-for="(val, index) in itemLists" >
           
            <i class="el-icon-remove-outline sub" @click="addAssistant(0, index)"></i>
          </div>
          </div> -->
                    <div class="item-wrap" v-if="itemList[0] && itemList[0].type == 0">
                        <p>关联数据报告</p>
                        <p><em>*</em>：</p>
                        <el-radio v-model="addEditInfo.associatedDataReport" :label="1">是</el-radio>
                        <el-radio v-model="addEditInfo.associatedDataReport" :label="0">否</el-radio>
                    </div>
                    <div v-if="addEditInfo.isOpenSummary == 1">
                        <p style="margin-top: 10px; font-size: 18px; font-weight: 600">评价小结：</p>
                        <div class="item-wrap">
                            <p class="input-s">名称</p>
                            <p><em>*</em>：</p>
                            <el-input
                                :class="form.summaryName == true ? 'width-5 has-error' : 'width-5'"
                                @focus="clarnHas(6)"
                                v-model="addEditInfo.summaryName"
                                disabled
                            ></el-input>
                            <span class="del-btn notselect" @click="removeItem()">删除评价项</span>
                        </div>
                    </div>
                    <el-button
                        type="primary"
                        class="edit-btn"
                        @click="goNext(true)"
                        v-if="itemList[0] && itemList[0].type == 0 && addEditInfo.associatedDataReport == 1"
                        >下一步</el-button
                    >
                    <el-button type="primary" class="edit-btn" @click="save" v-else>{{
                        $route.query.id ? '保存' : '提交'
                    }}</el-button>
                </div>
            </div>
        </div>
        <!-- 下一步，配置关联信息 -->
        <div class="content-wrap" v-show="!isShowFirstPage">
            <div class="item-scroll">
                <div class="box second-box">
                    <div class="item-wrap" style="margin-bottom: 20px">
                        <p>关联机构<em>*</em>：</p>
                        <el-cascader
                            v-model="addEditInfo.orgId"
                            :props="cascaderProps"
                            :options="departmentOptions"
                            clearable
                            :show-all-levels="false"
                            class="width-5"
                            placeholder="请选择关联机构"
                            filterable
                        ></el-cascader>
                    </div>
                    <div class="item-wrap rule-wrap">
                        <p>关联规则<em>*</em>：</p>
                        <div class="rule-item" v-for="(item, index) in ruleInfoArray" :key="item.item">
                            <div class="title">{{ item.sort + '、' + item.item + ' - ' + item.total + ' 分' }}</div>
                            <div class="item" v-for="(ite, idx) in item.rulesNum" :key="ite">
                                <el-select
                                    v-model="item['ruleArray'][idx]"
                                    placeholder="请选择平台关联指标"
                                    class="width-6"
                                >
                                    <el-option
                                        v-for="item in ruleList"
                                        :key="item.dictKey + item.dictName"
                                        :label="item.dictName"
                                        :value="item.dictKey"
                                    >
                                    </el-option>
                                </el-select>
                                <el-input
                                    class="width-8"
                                    v-model="item['numberArray'][idx]"
                                    placeholder="请输入权重系数"
                                ></el-input>
                                <i
                                    class="el-icon-circle-plus-outline el-icon"
                                    @click="changeRuleNum('add', index)"
                                    v-show="item.rulesNum < ruleList.length && idx == 0"
                                ></i>
                                <i
                                    class="el-icon-remove-outline el-icon"
                                    @click="changeRuleNum('', index, idx)"
                                    v-show="idx != 0"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <el-button type="text" class="edit-btn" @click="goNext(false)">上一步</el-button>
                    <el-button type="primary" class="edit-btn" @click="save">{{
                        $route.query.id ? '保存' : '提交'
                    }}</el-button>
                </div>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="previewShow" width="1000px">
            <p style="font-size: 16px; text-align: center; margin-bottom: 20px">{{ addEditInfo.name }}</p>
            <div class="evaluation-content">
                <el-table
                    v-if="strategy == 1 && itemLists.length > 0"
                    :data="itemLists"
                    style="width: 100%"
                    border
                    default-expand-all
                >
                    <el-table-column width="320" align="left" prop="levelOne" label="评价要素"></el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="分值">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.score }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="评分">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column v-if="type == 1 || type == 2" align="center" label="评语">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column
                        v-if="addEditInfo.isOpenRemarks == 1"
                        align="center"
                        :label="addEditInfo.remarksName"
                    >
                        <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.remarks"></el-input>
            </template> -->
                    </el-table-column>
                </el-table>
                <el-table
                    v-if="strategy == 2 && itemLists.length > 0"
                    :data="itemLists"
                    style="width: 100%"
                    border
                    default-expand-all
                    :span-method="(param) => objectSpanMethod(param, itemLists)"
                >
                    <el-table-column width="150" prop="levelOne" label="评价项目"></el-table-column>
                    <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"></el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="分值">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.score }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="评分">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column v-if="type == 1 || type == 2" align="center" label="评语">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column
                        v-if="addEditInfo.isOpenRemarks == 1"
                        align="center"
                        :label="addEditInfo.remarksName"
                    >
                        <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.remarks"></el-input>
            </template> -->
                    </el-table-column>
                </el-table>
                <el-table
                    v-if="strategy == 3 && itemLists.length > 0"
                    :data="itemLists"
                    style="width: 100%"
                    border
                    :header-cell-style="handerMethod"
                    default-expand-all
                    :span-method="(param) => objectSpanMethod(param, itemLists)"
                >
                    <el-table-column width="100" prop="levelOne" label="一级名称"> </el-table-column>
                    <el-table-column width="100" prop="levelTwo" label="评价项目"> </el-table-column>
                    <el-table-column width="320" align="left" prop="levelThree" label="评价要素"> </el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="分值">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.score }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="type == 0 || type == 2" align="center" label="评分">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column v-if="type == 1 || type == 2" align="center" label="评语">
                        <!-- <template slot-scope="scope">
              <div v-if="scope.row.type == 0">
                <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
              </div>
              <el-input v-else v-model="scope.row.content">
              </el-input>
            </template> -->
                    </el-table-column>
                    <el-table-column
                        v-if="addEditInfo.isOpenRemarks == 1"
                        align="center"
                        :label="addEditInfo.remarksName"
                    >
                        <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.remarks"></el-input>
            </template> -->
                    </el-table-column>
                </el-table>
                <div class="evaluation-parttwo" v-if="addEditInfo.isOpenSummary == 1">
                    <h3 class="part-title">{{ addEditInfo.summaryName }}</h3>
                    <textarea
                        class="evaluation-text"
                        v-model.trim="addEditInfo.summary"
                        style="resize: none"
                        type="textarea"
                    ></textarea>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="模板选择"
            :close-on-click-modal="false"
            :visible.sync="tempShow"
            :before-close="tempShowClose"
            width="490px"
        >
            <div class="dialog-wrap">
                <div id="auditFilm" ref="auditFilm" class="auditFilm"></div>
                <div class="auditItem">
                    <div class="dialog-item">
                        <p>评课模板</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="tempId" placeholder="请选择" class="width-5" filterable>
                            <el-option v-for="item in tempList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="useTheTemp">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="新增总结性评价"
            :close-on-click-modal="false"
            :visible.sync="openShow"
            :before-close="openShowClose"
            width="490px"
        >
            <div class="dialog-wrap">
                <div class="auditItem">
                    <div class="dialog-item">
                        <p style="width: 110px">总结性评价名称</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-3" v-model="content"></el-input>
                    </div>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="addText">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';

export default {
    name: '',
    data() {
        return {
            strategy: 3,
            addEditInfo: {
                name: '', // 评课模板名称
                score: 0, // 总分
                remarksName: '',
                isOpenRemarks: 0,
                itemList: [],
                isOpenSummary: 0,
                summaryName: '',
                associatedDataReport: 0,
            },
            itemList: [],
            itemLists: [
                // {
                //   item:'',
                //   type: 2,
                //   content:'',
                //   children: []
                // }
            ],
            type: 0,
            itemListss: [],
            openShow: false,
            content: '',
            tempShow: false, // 模板弹窗
            tempList: [], // 模板列表
            tempId: '', // 当前模板id
            currentTemp: '', // 当前模板name
            previewShow: false,
            form: {
                name: false,
                remarksName: false,
                itemList: [],
                summaryName: false,
            },
            isShowFirstPage: true,
            cascaderProps: {
                value: 'orgId',
                label: 'name',
                emitPath: false,
                checkStrictly: true,
            },
            departmentOptions: [],
            ruleList: [],
            ruleInfoArray: [],
        };
    },
    components: {},
    mounted() {
        this.getTemplate();
        if (this.$route.query.tepmid) {
            this.tempId = parseInt(this.$route.query.tepmid);
            this.getThemeInfo(this.tempId); //编辑获取主体信息
        }
    },
    methods: {
        clarnHas(key, val, vals, valss) {
            switch (key) {
                case 1:
                    this.form.name = false;
                    break;
                case 2:
                    this.form.remarksName = false;
                    break;
                case 3:
                    if (this.form.itemList && this.form.itemList[val] && this.form.itemList[val].hasError) {
                        this.form.itemList[val].hasError = false;
                        this.$forceUpdate();
                    }
                    break;
                case 4:
                    if (
                        this.form.itemList &&
                        this.form.itemList[val] &&
                        this.form.itemList[val].children[vals].hasError
                    ) {
                        this.form.itemList[val].children[vals].hasError = false;
                        this.$forceUpdate();
                    }
                    break;
                case 5:
                    if (
                        this.form.itemList &&
                        this.form.itemList[val] &&
                        this.form.itemList[val].children[vals].children[valss].hasError
                    ) {
                        this.form.itemList[val].children[vals].children[valss].hasError = false;
                        this.$forceUpdate();
                    }
                    break;
                case 6:
                    this.form.summaryName = false;
                    break;
                default:
                    break;
            }
        },
        //获取基本信息
        getThemeInfo(id) {
            this.$axios.get('/sm/template/info', {id: id}).then((res) => {
                this.addEditInfo = res.data;
                const arr = res.data.itemList;
                arr.forEach((el) => {
                    if (el.children && el.children.length > 0) {
                        el.show = 1;
                        el.children.forEach((ele) => {
                            if (ele.children && el.children.length > 0) {
                                ele.show = 1;
                            } else {
                                ele.show = 0;
                            }
                        });
                    } else {
                        el.show = 0;
                    }
                });
                this.itemList = arr;
            });
        },
        // 获取模板
        getTemplate() {
            this.$axios.get('/sm/template/listAll').then((res) => {
                this.tempList = res.data;
            });
        },
        // 应用模板
        useTemp() {
            this.tempShow = true;
        },
        // 关闭模板选择
        tempShowClose() {
            this.tempId = '';
            this.tempShow = false;
        },
        openShowDialog() {
            if (this.addEditInfo.summaryName !== '') {
                return this.$message('已有总结性评价项,请先删除！', 'error');
            }
            this.openShow = true;
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
        openPreview() {
            if (!this.verify(1)) {
                this.type = this.itemList[0] && this.itemList[0].type ? this.itemList[0].type : '';
                console.log(this.itemList, '22', this.type);
                let arr = [];
                for (let i in this.itemList) {
                    if (this.itemList[i].type == 0) {
                        const levelOne = this.itemList[i].item;
                        if (this.itemList[i].children.length > 0) {
                            for (let j in this.itemList[i].children) {
                                const levelTwo = this.itemList[i].children[j].item;
                                if (this.itemList[i].children[j].children.length > 0) {
                                    for (let k in this.itemList[i].children[j].children) {
                                        const levelThree = this.itemList[i].children[j].children[k].item;
                                        const obj = {
                                            levelOne: levelOne,
                                            levelTwo: levelTwo,
                                            levelThree: levelThree,
                                            score: this.itemList[i].children[j].children[k].score,
                                            remarks: '',
                                        };
                                        arr.push(obj);
                                    }
                                } else {
                                    const obj = {
                                        levelOne: levelOne,
                                        levelTwo: levelTwo,
                                        levelThree: '',
                                        score: this.itemList[i].children[j].score,
                                        remarks: '',
                                    };
                                    arr.push(obj);
                                }
                            }
                        } else {
                            const obj = {
                                levelOne: levelOne,
                                levelTwo: '',
                                levelThree: '',
                                score: this.itemList[i].score,
                                remarks: '',
                            };
                            arr.push(obj);
                        }
                    } else if (this.itemList[i].type == 1) {
                        const levelOne = this.itemList[i].item;
                        if (this.itemList[i].children.length > 0) {
                            for (let j in this.itemList[i].children) {
                                const levelTwo = this.itemList[i].children[j].item;
                                if (this.itemList[i].children[j].children.length > 0) {
                                    for (let k in this.itemList[i].children[j].children) {
                                        const levelThree = this.itemList[i].children[j].children[k].item;
                                        const obj = {
                                            levelOne: levelOne,
                                            levelTwo: levelTwo,
                                            levelThree: levelThree,
                                            content: '',
                                            remarks: '',
                                        };
                                        arr.push(obj);
                                    }
                                } else {
                                    const obj = {
                                        levelOne: levelOne,
                                        levelTwo: levelTwo,
                                        levelThree: '',
                                        content: '',
                                        remarks: '',
                                    };
                                    arr.push(obj);
                                }
                            }
                        } else {
                            const obj = {
                                levelOne: levelOne,
                                levelTwo: '',
                                levelThree: '',
                                content: '',
                                remarks: '',
                            };
                            arr.push(obj);
                        }
                    } else if (this.itemList[i].type == 2) {
                        const levelOne = this.itemList[i].item;
                        if (this.itemList[i].children.length > 0) {
                            for (let j in this.itemList[i].children) {
                                const levelTwo = this.itemList[i].children[j].item;
                                if (this.itemList[i].children[j].children.length > 0) {
                                    for (let k in this.itemList[i].children[j].children) {
                                        const levelThree = this.itemList[i].children[j].children[k].item;
                                        const obj = {
                                            levelOne: levelOne,
                                            levelTwo: levelTwo,
                                            levelThree: levelThree,
                                            score: this.itemList[i].children[j].children[k].score,
                                            remarks: '',
                                        };
                                        arr.push(obj);
                                    }
                                } else {
                                    const obj = {
                                        levelOne: levelOne,
                                        levelTwo: levelTwo,
                                        levelThree: '',
                                        score: this.itemList[i].children[j].score,
                                        remarks: '',
                                    };
                                    arr.push(obj);
                                }
                            }
                        } else {
                            const obj = {
                                levelOne: levelOne,
                                levelTwo: '',
                                levelThree: '',
                                score: this.itemList[i].score,
                                remarks: '',
                            };
                            arr.push(obj);
                        }
                    }
                }
                let x = 3;
                let a = arr.every((item) => !item.levelThree);
                if (a == true) {
                    x = 2;
                    let aa = arr.every((item) => !item.levelTwo);
                    if (aa == true) {
                        x = 1;
                    }
                }
                // if (this.type === 2) {
                //   x = 3;
                // }
                console.log(arr, '22');
                console.log(x, 'x');
                console.log(this.type, 'type');
                this.strategy = x;
                this.itemLists = arr;
                this.previewShow = true;
            }
        },
        openShowClose() {
            this.openShow = false;
            this.content = '';
        },
        // 应用模板
        useTheTemp() {
            if (!this.tempId) {
                this.$message('请选择模板', 'error');
                return;
            }
            this.$axios.get('/sm/template/selectItemByTemplate', {templateId: this.tempId}).then((res) => {
                this.itemList = res.data.itemList ? res.data.itemList : [];
                this.addEditInfo.isOpenRemarks = res.data.isOpenRemarks;
                this.addEditInfo.isOpenSummary = res.data.isOpenSummary;
                this.addEditInfo.remarksName = res.data.remarksName;
                this.addEditInfo.summaryName = res.data.summaryName;
                this.addEditInfo.associatedDataReport = 0;
                this.currentTemp = this.tempList.filter((item) => item.id === this.tempId)[0].name;
                this.changeScore();
                this.tempShow = false;
            });
        },
        // 清除模板 ·
        handleClose() {
            this.itemList = [];
            this.addEditInfo.isOpenRemarks = 0;
            this.addEditInfo.isOpenSummary = 0;
            this.addEditInfo.remarksName = '';
            this.addEditInfo.summaryName = '';
            this.addEditInfo.associatedDataReport = 0;
            this.currentTemp = '';
            this.changeScore();
        },
        // 显示隐藏一级
        handleOpen(type, index) {
            if (type == 1) {
                this.itemList[index].show = 0;
            } else {
                this.itemList[index].show = 1;
            }
            this.$forceUpdate();
        },
        // 显示隐藏二级
        handleOpens(type, index, indexs) {
            if (type == 1) {
                this.itemList[index].children[indexs].show = 0;
            } else {
                this.itemList[index].children[indexs].show = 1;
            }
            this.$forceUpdate();
        },
        removeItem() {
            this.addEditInfo.summaryName = '';
            this.addEditInfo.isOpenSummary = 0;
        },
        addText() {
            if (this.content == '') {
                return this.$message('请填写总结性评价名称', 'error');
            }
            if (this.content.length > 100) {
                return this.$message('总结性评价名称不能超过100字符', 'error');
            }
            this.addEditInfo.summaryName = this.content;
            this.addEditInfo.isOpenSummary = 1;
            this.content = '';
            this.openShow = false;
        },
        //添加平分项
        addAssistant(type, index) {
            //1添加 0减
            if (type == 1) {
                if (this.itemList.length > 0) {
                    let isTrue = true;
                    for (let i in this.itemList) {
                        if (this.itemList[i].type == 1 || this.itemList[i].type == 2) {
                            isTrue = false;
                        }
                    }
                    if (isTrue == false) {
                        return this.$message(
                            '评分评价项与文字评价项/分数及文字评价项不支持同时存在于同个模板中！',
                            'error'
                        );
                    }
                }
                if (this.itemList.length == 100) {
                    return this.$message('分数评价项最多100个', 'error');
                }
                this.itemList.push({item: '', show: 1, type: 0, score: '', total: 0, children: []});
                this.changeScore();
            } else if (type == 2) {
                if (this.itemList.length > 0) {
                    let isTrue = true;
                    for (let i in this.itemList) {
                        if (this.itemList[i].type == 0 || this.itemList[i].type == 2) {
                            isTrue = false;
                        }
                    }
                    if (isTrue == false) {
                        return this.$message(
                            '评分评价项与文字评价项/分数及文字评价项不支持同时存在于同个模板中！',
                            'error'
                        );
                    }
                }
                if (this.itemList.length == 100) {
                    return this.$message('文字评价项最多100个', 'error');
                }
                this.itemList.push({item: '', show: 1, type: 1, children: []});
            } else if (type == 3) {
                if (this.itemList.length > 0) {
                    let isTrue = true;
                    for (let i in this.itemList) {
                        if (this.itemList[i].type == 1 || this.itemList[i].type == 0) {
                            isTrue = false;
                        }
                    }
                    if (isTrue == false) {
                        return this.$message('评分评价项与文字评价项不支持同时存在于同个模板中！', 'error');
                    }
                }
                if (this.itemList.length == 100) {
                    return this.$message('分数及文字评价项最多100个', 'error');
                }
                this.itemList.push({item: '', show: 1, type: 2, score: '', total: 0, children: []});
                this.changeScore();
            } else {
                // if(this.itemList.length == 1){
                // 	return this.$message('评价项最少1个', 'error');
                // }
                if (this.itemList[index].children.length > 0) {
                    this.$confirm('删除该评价项，则将删除下级评价项,确定继续吗?', '退出提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                        .then(() => {
                            this.itemList.splice(index, 1);
                            this.changeScore();
                        })
                        .catch(() => {});
                } else {
                    this.itemList.splice(index, 1);
                    this.changeScore();
                }
            }
        },
        //添加子平分项
        addAssistants(type, index, indexs) {
            //1添加 0减
            if (type == 1) {
                if (this.itemList[index].children.length == 100) {
                    return this.$message('评分项最多100个', 'error');
                }
                this.itemList[index].show = 1;
                this.itemList[index].score = 0;
                this.itemList[index].children.push({item: '', type: 0, show: 1, score: '', children: [], total: 0});
                this.changeScore();
            } else if (type == 2) {
                if (this.itemList[index].children.length == 100) {
                    return this.$message('文字分项最多100个', 'error');
                }
                this.itemList[index].show = 1;
                this.itemList[index].children.push({item: '', type: 1, show: 1, children: []});
            } else if (type == 3) {
                if (this.itemList[index].children.length == 100) {
                    return this.$message('分数及文字分项最多100个', 'error');
                }
                this.itemList[index].show = 1;
                this.itemList[index].score = 0;
                this.itemList[index].children.push({item: '', type: 2, show: 1, score: '', children: [], total: 0});
                this.changeScore();
            } else {
                if (this.itemList[index].children.length > 0) {
                    if (this.itemList[index].children[indexs].children.length > 0) {
                        this.$confirm('删除该评价项，则将删除下级评价项,确定继续吗?', '退出提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        })
                            .then(() => {
                                this.itemList[index].children.splice(indexs, 1);
                                this.changeScore();
                            })
                            .catch(() => {});
                    } else {
                        this.itemList[index].children.splice(indexs, 1);
                        this.changeScore();
                    }
                }
            }
        },
        //添加子平分项s
        addsAssistants(type, index, indexs, indexss) {
            //1添加 0减
            if (type == 1) {
                if (this.itemList[index].children[indexs].children.length == 100) {
                    return this.$message('评分项最多100个', 'error');
                }
                this.itemList[index].children[indexs].score = 0;
                this.itemList[index].children[indexs].children.push({item: '', type: 0, score: ''});
                this.changeScore();
            } else if (type == 2) {
                if (this.itemList[index].children[indexs].children.length == 100) {
                    return this.$message('文字项最多100个', 'error');
                }
                this.itemList[index].children[indexs].children.push({item: '', type: 1});
            } else if (type == 3) {
                if (this.itemList[index].children[indexs].children.length == 100) {
                    return this.$message('文书及文字评价最多100个', 'error');
                }
                this.itemList[index].children[indexs].score = 0;
                this.itemList[index].children[indexs].children.push({item: '', type: 2, score: ''});
                this.changeScore();
            } else {
                if (this.itemList[index].children[indexs].children.length > 0) {
                    this.itemList[index].children[indexs].children.splice(indexss, 1);
                    this.changeScore();
                }
            }
        },
        blurNumber(e) {
            if (!e.target.value) {
                e.target.value = 1;
            }
        },
        // 改变每项分数
        changeScore() {
            let num = 0;
            for (let i in this.itemList) {
                if (!this.itemList[i].score) {
                    this.itemList[i].score = 1;
                }
                if (this.itemList[i].type == 0 || this.itemList[i].type == 2) {
                    let sum = 0;
                    if (this.itemList[i].children.length > 0) {
                        for (let j in this.itemList[i].children) {
                            let sums = 0;
                            if (!this.itemList[i].children[j].score) {
                                this.itemList[i].children[j].score = 1;
                            }
                            if (this.itemList[i].children[j].children.length > 0) {
                                for (let k in this.itemList[i].children[j].children) {
                                    if (!this.itemList[i].children[j].children[k].score) {
                                        this.itemList[i].children[j].children[k].score = 1;
                                    }
                                    num = num + this.itemList[i].children[j].children[k].score;
                                    sums = sums + this.itemList[i].children[j].children[k].score;
                                }
                            } else {
                                sums = sums + this.itemList[i].children[j].score;
                                num = num + this.itemList[i].children[j].score;
                            }
                            this.itemList[i].children[j].total = sums;
                            sum = sum + this.itemList[i].children[j].total;
                        }
                    } else {
                        sum = sum + this.itemList[i].score;
                        num = num + this.itemList[i].score;
                    }
                    this.itemList[i].total = sum;
                }
            }
            this.addEditInfo.score = num;
        },
        //返回
        goBack() {
            this.$router.go(-1);
        },
        save() {
            if (this.addEditInfo.associatedDataReport == 1 && this.verifyRule()) {
                return;
            }
            const result = [];
            this.ruleInfoArray.forEach((item) => {
                // 遍历数组的每一项
                for (let i = 0; i < item.rulesNum; i++) {
                    // 构建新对象
                    const newObj = {
                        dimensionCode: item.item,
                        platformIndexId: item.ruleArray[i] ?? null, // ruleArray 的第 i 项作为 dictKey
                        weight: item.numberArray[i] ?? null, // numberArray 的第 i 项作为 score
                        sort: i, // 从 0 开始递增
                        score: item.total,
                        _relationId: item._relationId,
                    };
                    result.push(newObj);
                }
            });
            this.addEditInfo.itemList = this.mergeArrays(this.itemList, result);
            console.log('this.addEditInfo', this.addEditInfo);
            let url = '/sm/template/save';
            if (this.$route.query.tepmid) {
                url = '/sm/template/update';
                this.addEditInfo.id = this.$route.query.tepmid;
            }
            this.$axios.post(url, this.addEditInfo).then((res) => {
                if (res.code == 200) {
                    this.$route.query.tepmid
                        ? this.$message('修改模板成功', 'success')
                        : this.$message('新增模板成功', 'success');
                    this.goBack();
                }
            });
        },
        //验证
        verify(type) {
            Message.closeAll();
            if (!this.addEditInfo.name) {
                this.form.name = true;
                this.$message(type ? '请补充内容再进行预览' : '评课模板名称不能为空', 'error');
                return true;
            }
            if (this.addEditInfo.name.length > 20) {
                this.form.name = true;
                this.$message('评课模板名称长度限制20字符内', 'error');
                return true;
            }
            if (this.addEditInfo.isOpenRemarks == 1) {
                if (this.addEditInfo.remarksName == '') {
                    this.form.remarksName = true;
                    this.$message(type ? '请补充内容再进行预览' : '备注项名称不能为空', 'error');
                    return true;
                }
                if (this.addEditInfo.remarksName.length > 20) {
                    this.form.remarksName = true;
                    this.$message('备注项名称长度限制20字符内', 'error');
                    return true;
                }
            }
            if (this.itemList.length == 0 && this.addEditInfo.isOpenSummary == 0) {
                this.$message(type ? '请补充内容再进行预览' : '请添加评课评价项', 'error');
                return true;
            }
            this.form.itemList = this.itemList;
            for (let i in this.itemList) {
                if (this.itemList[i].item === '') {
                    this.form.itemList[i].hasError = true;
                    this.$forceUpdate();
                    let message = '分数及文字';
                    if (this.itemList[i].type !== 2) {
                        message = this.itemList[i].type == 0 ? '评分' : '文字';
                    }
                    this.$message(
                        type ? '请补充内容再进行预览' : `${message}` + `评价项一级项目${Number(i) + 1} 名称不能为空！`,
                        'error'
                    );
                    return true;
                }
                if (this.itemList[i].item.length > 100) {
                    this.form.itemList[i].hasError = true;
                    this.$forceUpdate();
                    let message = '分数及文字';
                    if (this.itemList[i].type !== 2) {
                        message = this.itemList[i].type == 0 ? '评分' : '文字';
                    }
                    this.$message(`${message}` + `评价项一级项目${Number(i) + 1} 名称长度限制100字符内`, 'error');
                    return true;
                }
                if (this.itemList[i].children && this.itemList[i].children.length > 0) {
                    for (let j in this.itemList[i].children) {
                        if (this.itemList[i].children[j].item === '') {
                            this.form.itemList[i].children[j].hasError = true;
                            this.$forceUpdate();
                            let message = '分数及文字';
                            if (this.itemList[i].type !== 2) {
                                message = this.itemList[i].type == 0 ? '评分' : '文字';
                            }
                            this.$message(
                                type
                                    ? '请补充内容再进行预览'
                                    : `${message}` +
                                          `评价项一级项目${Number(i) + 1}下的二级项目${Number(j) + 1} 名称不能为空！`,
                                'error'
                            );
                            return true;
                        }
                        if (this.itemList[i].children[j].item.length > 1000) {
                            this.form.itemList[i].children[j].hasError = true;
                            this.$forceUpdate();
                            let message = '分数及文字';
                            if (this.itemList[i].type !== 2) {
                                message = this.itemList[i].type == 0 ? '评分' : '文字';
                            }
                            this.$message(
                                `${message}` +
                                    `评价项一级项目${Number(i) + 1}下的二级项目${Number(j) + 1} 名称长度限制1000字符内`,
                                'error'
                            );
                            return true;
                        }
                        if (this.itemList[i].children[j].children && this.itemList[i].children[j].children.length > 0) {
                            for (let k in this.itemList[i].children[j].children) {
                                if (this.itemList[i].children[j].children[k].item === '') {
                                    this.form.itemList[i].children[j].children[k].hasError = true;
                                    this.$forceUpdate();
                                    let message = '分数及文字';
                                    if (this.itemList[i].type !== 2) {
                                        message = this.itemList[i].type == 0 ? '评分' : '文字';
                                    }
                                    this.$message(
                                        type
                                            ? '请补充内容再进行预览'
                                            : `${message}` +
                                                  `评价项一级项目${Number(i) + 1}下的二级项目${
                                                      Number(j) + 1
                                                  }下的三级项目${Number(k) + 1} 名称不能为空！`,
                                        'error'
                                    );
                                    return true;
                                }
                                if (this.itemList[i].children[j].children[k].item.length > 1000) {
                                    this.form.itemList[i].children[j].children[k].hasError = true;
                                    this.$forceUpdate();
                                    let message = '分数及文字';
                                    if (this.itemList[i].type !== 2) {
                                        message = this.itemList[i].type == 0 ? '评分' : '文字';
                                    }
                                    this.$message(
                                        `${message}` +
                                            `评价项一级项目${Number(i) + 1}下的二级项目${Number(j) + 1}下的三级项目${
                                                Number(k) + 1
                                            } 名称长度限制1000字符内`,
                                        'error'
                                    );
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            if (this.addEditInfo.isOpenSummary == 1) {
                if (this.addEditInfo.summaryName == '') {
                    this.form.summaryName = true;
                    this.$message(type ? '请补充内容再进行预览' : '评价小结名称不能为空', 'error');
                    return true;
                }
                if (this.addEditInfo.summaryName.length > 100) {
                    this.form.summaryName = true;
                    this.$message('评价小结名称限制100字符内！', 'error');
                    return true;
                }
            }
        },
        goNext(type) {
            if (!this.verify()) {
                if (type) {
                    this.isShowFirstPage = !type;
                    this.getOrgOptions();
                    this.getProductList();
                    console.log('itemList', this.itemList);
                    this.ruleInfoArray = this.itemList.map(({sort, total, item}, index) => ({
                        sort: sort ? sort : index + 1,
                        total,
                        item,
                        ruleArray: [],
                        numberArray: [],
                        rulesNum: 1,
                        _relationId: index,
                    }));
                    this.addEditInfo.orgId = '';
                } else {
                    this.$confirm('返回上一步后，当前已添加的关联指标内容将被清空，请谨慎操作！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                        .then(() => {
                            this.isShowFirstPage = !type;
                        })
                        .catch(() => {});
                }
            }
        },
        async getOrgOptions() {
            await this.$axios.get('/sys/org/listDepartmentAndUser', {isAll: 1}).then((res) => {
                this.departmentOptions = [];
                this.departmentOptions = res.data;
            });
            return this.departmentOptions;
        },
        // 获取产品下拉
        getProductList() {
            this.$axios.get('/aiAnalysisDict/list', {dictModel: 'integral_analysis'}).then((res) => {
                if (res.code == 200) {
                    this.ruleList = res.data.resData.filter(item => item.dictKey !== '0');
                }
            });
        },
        addRule() {
            this.ruleNum++;
        },
        decreaseRule(index) {
            this.ruleNum--;
            this.ruleArray1.splice(index, 1);
            this.numberArray.splice(index, 1);
        },
        changeRuleNum(type, index, idx) {
            if (type == 'add') {
                this.ruleInfoArray[index].rulesNum++;
            } else {
                this.ruleInfoArray[index].rulesNum--;
                this.ruleInfoArray[index].ruleArray.splice(idx, 1);
                this.ruleInfoArray[index].numberArray.splice(idx, 1);
            }
        },
        verifyRule() {
            if (!this.addEditInfo.orgId) {
                this.$message('请选择关联机构！', 'error');
                return true;
            }
            for (let i = 0; i < this.ruleInfoArray.length; i++) {
                let item = this.ruleInfoArray[i];
                if (item.ruleArray.length == 0) {
                    this.$message(item['item'] + '下有指标未选择！', 'error');
                    return true;
                }
                if (item.numberArray.length == 0) {
                    this.$message('请填写' + item['item'] + '下的指标权重系数！', 'error');
                    return true;
                }
                if (item.ruleArray.length < item.numberArray.length) {
                    this.$message(item['item'] + '下有指标未选择！', 'error');
                    return true;
                }
                if (item.ruleArray.length > item.numberArray.length) {
                    this.$message('请填写' + item['item'] + '下的指标权重系数！', 'error');
                    return true;
                }
                if (item.ruleArray.length != item.rulesNum) {
                    this.$message(item['item'] + '下有指标未选择！', 'error');
                    return true;
                }
                if (new Set(item.ruleArray).size !== item.ruleArray.length) {
                    this.$message(item['item'] + '下指标重复添加！', 'error');
                    return true;
                }
                for (let j = 0; j < item.numberArray.length; j++) {
                    let ite = item.numberArray[j];
                    if (!ite) {
                        this.$message('请填写' + item['item'] + '下的指标权重系数！', 'error');
                        return true;
                    }
                    if (!Number.isFinite(parseFloat(ite))) {
                        this.$message('权重系数是数值类型！', 'error');
                        return true;
                    }
                    if (ite <= 0 || ite > 1) {
                        this.$message('权重系数只能是大于0，小于等于1的数值！', 'error');
                        return true;
                    }
                }
            }
        },
        mergeArrays(arr1, arr2) {
            // 将第二个数组按 id 分组
            const configMap = new Map();
            arr2.forEach((item) => {
                const id = item._relationId;
                console.log('id---', id);

                if (!configMap.has(id)) {
                    configMap.set(id, []);
                }
                configMap.get(id).push(item);
            });

            // 遍历第一个数组，添加 config 属性
            return arr1.map((item, index) => ({
                ...item,
                smCommentTemplateIndexConfigs: configMap.get(index) || [], // 如果没有匹配则返回空数组
            }));
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.width-10 {
    width: 600px;
}

.buttonRight {
    cursor: pointer;
    margin-left: 8px;
    border: 8px solid white;
    border-left: 10px solid #03a9f4;
    height: 0;
    width: 0;
}

.buttonBottom {
    cursor: pointer;
    margin: 8px 0 0 10px;
    border: 8px solid white;
    border-top: 10px solid #03a9f4;
    height: 0;
    width: 0;
}

.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 20px 10px 54px 60px;
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
    overflow: auto;
    height: 100%;
    width: 100%;

    .box {
        min-width: 100%;
        // overflow-y: scroll;
        padding-top: 60px;
        // width: 105%;
        // height: 100%;
    }
    .second-box {
        padding-top: 0;
    }
    .el-input {
        margin-left: 8px;
    }
}

.special {
    display: flex;
    margin-top: 25px;
    flex-direction: column;

    .item-wrap-one {
        display: flex;
        align-items: center;
    }

    .item-wrap-children {
        padding-left: 30px;
        margin-top: 20px;
        display: flex;
        align-items: center;
    }

    .total {
        font-size: 14px;
        width: 550px;
        text-align: right;
    }

    .score {
        margin-left: 40px;
    }

    .input-s {
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    .input-s-width {
        width: 160px;
    }

    em {
        color: #f64646;
    }

    .usetemplate {
        cursor: pointer;
        font-size: 14px;
        line-height: 17px;
        color: #5b8cff;
    }

    p:first-child {
        width: 110px;
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

    .del-btn {
        cursor: pointer;
        font-size: 14px;
        line-height: 17px;
        color: #fe5151;
        margin-left: 14px;
    }
}

.item-wrap {
    display: flex;
    align-items: center;
    margin-top: 25px;

    .specialp {
        margin-left: 50px;
        // width: 94px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    .item-wrap-one {
        display: flex;
        align-items: center;
    }

    .item-wrap-children {
        display: flex;
        align-items: center;
    }

    .total {
        font-size: 14px;
        width: 550px;
        text-align: right;
    }

    .score {
        margin-left: 40px;
    }

    .input-s {
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }

    em {
        color: #f64646;
    }

    .usetemplate {
        cursor: pointer;
        font-size: 14px;
        line-height: 17px;
        color: #5b8cff;
    }

    p:first-child {
        width: 100px;
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

    .del-btn {
        cursor: pointer;
        font-size: 14px;
        line-height: 17px;
        color: #fe5151;
        margin-left: 14px;
    }
}
.rule-wrap {
    align-items: flex-start;
    margin-top: 0;
    flex-wrap: wrap;

    p:nth-child(2) {
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }
    .rule-item {
        width: 55%;
        margin-left: 100px;
        font-size: 14px;
        color: #303133;

        .title {
            margin-top: 12px;
        }

        .item {
            display: flex;
            align-items: center;
            margin: 12px 0;
        }

        .el-icon {
            font-size: 35px;
            color: #d7d7d7;
            margin-left: 10px;
        }
    }
    .rule-item:first-of-type {
        margin-left: 0;
    }
}
.add-assistant {
    cursor: pointer;
    text-align: center;
    width: 138px;
    height: 40px;
    line-height: 40px;
    border: 1px #dcdee2 dashed;
    font-size: 14px;
    color: #5b8cff;
    border-radius: 3px;
    // position: relative;
    margin-left: 20px;
    top: 25px;
    left: 116px;
}

.edit-btn {
    width: 160px;
    height: 40px;
    margin: 55px 0 10px 114px;
}

.dialog-btn {
    justify-content: center;
}

.evaluation-text {
    width: 100%;
    height: 60px;
}

.width-6x {
    width: 150px;
}

.has-error {
    -webkit-box-shadow: 0 0 6px #ffc3c3 !important;
    box-shadow: 0 0 6px #ffc3c3 !important;

    ::v-deep .el-input__inner {
        border-color: #ff5d5d !important;
    }
}
</style>
<style lang="scss">
.evaluation-content {
    .el-table {
        .cell {
            white-space: pre-wrap;
        }
    }
}
</style>

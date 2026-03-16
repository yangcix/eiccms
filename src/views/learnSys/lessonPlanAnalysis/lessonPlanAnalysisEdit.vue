<template>
  <div class="second-wrap">
    <p class="content-title">
      <el-page-header
          @back="goBack"
          :content="`${$route.query.themeid ? '编辑' : '新增'}教案分析`"
      ></el-page-header>
    </p>
    <div class="content-wrap">
      <div class="item-scroll">
        <div class="box">
          <div class="item-scroll-line">
            <div class="item-wrap" v-show="!$route.query.id">
              <p>方式<em>*</em>：</p>
              <el-radio-group v-model="addEditInfo.manner" class="wrap-radio">
                <el-radio :label="0">在线新增</el-radio>
                <el-radio :label="1">本地上传</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="item-scroll-line">
            <div class="item-wrap" style="float: left">
              <p>课题<em>*</em>：</p>
              <el-input
                  class="width-2"
                  v-model="addEditInfo.name"
                  placeholder="请输入课程名称"
                  clearable
              ></el-input>
            </div>
            <div class="item-wrap" style="float: left;padding-left: 20px;width: 47.5%">
              <p>类型<em>*</em>：</p>
              <el-select
                  :popper-append-to-body="false"
                  v-model="addEditInfo.classType"
                  placeholder="选择课程类型"
                  class="width-input"
                  filterable
              >
                <el-option
                    v-for="item in classTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
              <!-- <p class="err-notice">注：提前添加设备并绑定至直播教室</p> -->
            </div>
          </div>
          <div class="item-scroll-line">
            <div class="item-wrap" style="float: left;width: 47.5%">
              <p>科目<em>*</em>：</p>
              <el-select
                  :popper-append-to-body="false"
                  v-model="addEditInfo.subjectId"
                  placeholder="选择科目"
                  class="width-input"
                  filterable
              >
                <el-option
                    v-for="item in subjectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="item-wrap" style="float: left;padding-left: 20px;width: 47.5%">
              <p>课时<em>*</em>：</p>
              <el-input
                  class="width-input"
                  v-model="addEditInfo.classTime"
                  placeholder="请输入课时"
                  clearable
              ></el-input>
              <p style="padding-left: 10px;font-size: 14px"> 课时</p>
            </div>
          </div>
          <div class="item-scroll-line">
            <div class="item-wrap" style="float: left;width: 47.5%">
              <p>教师<em>*</em>：</p>
              <el-select
                  :popper-append-to-body="false"
                  v-model="addEditInfo.teacherId"
                  placeholder="选择教师"
                  class="width-input"
                  filterable
              >
                <el-option
                    v-for="item in teacherList"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId"
                >
                </el-option>
              </el-select>
            </div>
            <div class="item-wrap" style="float: left;padding-left: 20px;width: 47.5%">
              <p>年级<em>*</em>：</p>
              <el-select
                  :popper-append-to-body="false"
                  v-model="addEditInfo.gradeId"
                  placeholder="选择年级"
                  class="width-input"
                  filterable
              >
                <el-option
                    v-for="item in gradeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 0">
            <div class="item-wrap">
              <p>教学目标<em>*</em>：</p>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 0">
            <div class="item-wrap" style="margin-top: 0;margin-left: 78px">
              <p>知识与技能</p>
            </div>
            <div>
              <el-input
                  type="textarea"
                  style="width: 90%;margin-left: 78px"
                  v-model="addEditInfo.teachingObjectivesKnowledge"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="了解......理解......掌握......灵活运用........"
                  clearable
              >
              </el-input>
            </div>
            <div class="item-wrap" style="margin-top: 0;margin-left: 78px">
              <p>过程与方法</p>
            </div>
            <div>
              <el-input
                  type="textarea"
                  style="width: 90%;margin-left: 78px"
                  v-model="addEditInfo.teachingObjectivesProcess"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="在.....的活动中，用...的方法，提高学生...的能力，培养.....能力"
                  clearable
              >
              </el-input>
              <div class="item-wrap" style="margin-top: 0;margin-left: 78px">
                <p style="width: 220px">情感、态度和价值观</p>
              </div>
              <div>
                <el-input
                    type="textarea"
                    style="width: 90%;margin-left: 78px"
                    v-model="addEditInfo.teachingObjectivesEmotion"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="通过学习.....感受.....获得......体会……感情；产生…… 共鸣；培养……精神；陶冶……情操"
                    clearable
                >
                </el-input>
              </div>
            </div>
          </div>
          <div class="item-scroll-line">
            <div class="item-wrap" style="float: left;width: 96.4%">
              <p>教学重点<em>*</em>：</p>
              <el-input
                  class="width-input"
                  v-model="addEditInfo.teachingFocus"
                  placeholder="请输入课程名称"
                  clearable
              ></el-input>
            </div>
          </div>
          <div class="item-scroll-line">
            <div class="item-wrap" style="float: left;margin-bottom: 10px;width: 96.4%">
              <p>教学难点<em>*</em>：</p>
              <el-input
                  class="width-input"
                  v-model="addEditInfo.teachingNodus"
                  placeholder="请输入课程名称"
                  clearable
              ></el-input>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 0">
            <div class="item-wrap" style="margin-top: 10px">
              <p>教学过程<em>*</em>：</p>
            </div>
            <div style="margin-left: 65px">
              <div style="border: 1px solid #ccc;width: 96%">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="teachingProcessEditor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="addEditInfo.teachingProcess"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreatedTeachingProcess"
                />
              </div>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 0">
            <div class="item-wrap" style="margin-top: 0">
              <p>作业布置<em>*</em>：</p>
            </div>
            <div style="margin-left: 65px">
              <div style="border: 1px solid #ccc;width: 96%">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="assignmentAssignmentsEditor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="addEditInfo.assignmentAssignments"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreatedAssignmentAssignments"
                />
              </div>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 0">
            <div class="item-wrap" style="margin-top: 0">
              <p>板书设计<em>*</em>：</p>
            </div>
            <div style="margin-left: 65px">
              <div style="border: 1px solid #ccc;width: 96%">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="boardBookDesignEditor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="addEditInfo.boardBookDesign"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreatedBoardBookDesign"
                />
              </div>
            </div>
          </div>
          <div class="item-scroll-line" v-if="addEditInfo.manner === 1">
            <div class="item-wrap">
              <p>教案<em>*</em>：</p>
              <el-button class="upload-btn" size="small" type="primary" @click="uploadFile">点击上传</el-button>
              <el-button class="upload-btn" size="small" type="info" @click="downloadTemplateFile">下载模板</el-button>
            </div>
            <p style="margin: 10px 0 220px 80px;font-size: 14px;color: #cccccc">仅支持上传后缀为docx文件，文件50M以下</p>
          </div>
          <el-button
              :loading="loadingBtn"
              type="primary"
              class="edit-btn"
              @click="editLessonPlanAnalysis"
          >确认
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {baseUrl} from "@/assets/js/utils";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'


export default {
  name: "",
  data() {
    return {
      aiNum: 0,
      aiType: JSON.parse(localStorage.getItem("sysInfo")).aiConfigId,
      feeModel: JSON.parse(localStorage.getItem("sysInfo")).type,
      studentVideo: [],
      teacherVideo: [],
      playUrl: "",
      vp: null,
      uploadUrl: baseUrl + "/sm/label/save",
      classTypeList: [],
      gradeList: [],
      classList: [],
      subjectList: [],
      versions: JSON.parse(sessionStorage.getItem("userInfo")) || [],
      innerVisible: false,
      teacherList: [],
      fileList: [],
      props: {multiple: true, label: "name", value: "id", emitPath: false},
      addEditInfo: {
        status: 0,
        manner: 0,
        isResetting: 0,
        name: "",
        classType: "",
        classTime: "",
        gradeId: "",
        teacherId: "",
        subjectId: "",
        teachingObjectivesKnowledge: "",
        teachingObjectivesProcess: "",
        teachingObjectivesEmotion: "",
        teachingFocus: "",
        teachingNodus: "",
        teachingProcess: "",
        assignmentAssignments: "",
        boardBookDesign: "",
        templatePath: "",
      },
      valData: [],
      loadingBtn: false,
      loadingBtnOne: false,
      eduFileUrl: baseUrl + "/upload/uploadTeachingFile",
      teachingFileIds: [], // 一键发布时上传文件数组
      loading: false,
      activeName: "first",
      pages: 0,
      pageNum: 1,
      totalS: '',
      playVisible: false, // 视频播放窗口
      objectName: "", // 绑定视频名称
      teachingProcessEditor: null,
      assignmentAssignmentsEditor: null,
      boardBookDesignEditor: null,
      html: '<p>hello</p>',
      toolbarConfig: {
        excludeKeys: [
          "group-video", "insertVideo", "uploadVideo",
          "emotion",
        ],
      },
      editorConfig: {placeholder: '请输入内容...'},
      mode: 'default', // or 'simple'
    };
  },
  components: {Editor, Toolbar},
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  computed: {
    ...mapState({
      aiUploadTable: "aiUploadTable",
    }),
  },
  mounted() {
    this.getClassTypeList(); // 获取课型
    this.getSubjectList();
    this.getTeacherList();
    this.getGradeList(2);
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getInfo();
    }
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p style="font-size: inherit">' +
          '①导入环节：直接导入、复习导入、问题导入、故事导入、设疑导入等等。\n' +
          '②讲授新课：新授是教学设计的重头戏，需写出针对教学内容授课步骤安排。\n' +
          '③归纳小结：要考虑怎样进行，是教师还是学生归纳，以及所需时间。\n' +
          '（输入中文、英文大小写、数字及符号，不超过10000个字符；可插入图片；）\n' +
          '</p>'
    }, 1500)
  },
  methods: {
    getInfo() {
      this.$axios.get("/lessonPlanAnalysis/info").then((res) => {
        if (res.code != 200) {
          this.addEditInfo = res.data;
        }
      });
    },
    getCount() {
      this.$axios.get("/aiGrinding/getCount").then((res) => {
        if (res.code != 200) {
          return;
        }
      });
    },
    getAiNum() {
      this.$axios.get("/aiRecharge/count").then((res) => {
        if (res.code == 200) {
          this.aiNum = res.data.aiClass;
        }
      });
    },
    onCreatedTeachingProcess(editor) {
      this.teachingProcessEditor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onCreatedAssignmentAssignments(editor) {
      this.assignmentAssignmentsEditor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onCreatedBoardBookDesign(editor) {
      this.boardBookDesignEditor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getClassTypeList() {
      this.$axios.get("/aiGrinding/getClassType").then((res) => {
        this.classTypeList = res.data;
        this.addEditInfo.classTypeId = res.data[0].id;
      });
    },
    getSubjectList() {
      this.$axios.get("/aiGrinding/getSubject").then((res) => {
        this.subjectList = res.data;
      });
    },
    getGradeList(id) {
      this.gradeList = [
        {
          "id": 1,
          "name": "一年级",
          "type": null,
          "gradeId": 1
        }
      ];
      // this.$axios.get("/aiGrinding/getGrade?orgId=" + id + "").then((res) => {
      //   this.gradeList = res.data;
      // });
    },
    getClassList() {
      this.$axios
          .get("/aiGrinding/getClass?id=" + this.addEditInfo.grindingGrade)
          .then((res) => {
            this.classList = res.data;
          });
    },
    getTeacherList() {
      let data = {
        famous: 0,
      };
      this.$axios.get("/sm/interactive/getUser", data).then((res) => {
        this.teacherList = res.data;
      });
    },
    editLessonPlanAnalysis() {
      let url = "";
      if (this.id) {
        url = "/lessonPlanAnalysis/update";
      } else {
        url = "/lessonPlanAnalysis/save";
      }
      if (!url) {
        this.$message("新增或编辑请求时出现错误", "error");
      }
      if (this.paramVerify()) {
        return;
      }
      this.$axios.post(url, this.addEditInfo).then((res) => {
        if (res.code == 200) {
          this.$message(res.message, "success")
        } else {
          this.$message(res.message, "error")
        }
      });
    },
    paramVerify() {
      if (!this.addEditInfo.name) {
        this.$message("课题名称不能为空", "error")
        return true;
      }
      if (!this.addEditInfo.classType) {
        this.$message("课堂类型不能为空", "error");
        return true;
      }
      if (!this.addEditInfo.classTime && this.addEditInfo.classTime < 1) {
        this.$message("课时不能为空", "error");
        return true;
      }
      if (!this.addEditInfo.gradeId) {
        this.$message("年级不能为空", "error");
        return true;
      }
      if (!this.addEditInfo.teacherId) {
        this.$message("教师不能为空", "error");
        return true;
      }
      if (!this.addEditInfo.subjectId) {
        this.$message("科目不能为空", "error");
        return true;
      }
      let manner = this.addEditInfo.manner;
      if (manner === 0) {
        if (!this.addEditInfo.teachingObjectivesKnowledge) {
          this.$message("教学目标-知识与技能不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.teachingObjectivesProcess) {
          this.$message("教学目标-过程与方法不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.teachingObjectivesEmotion) {
          this.$message("教学目标-情感、态度和价值观科目不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.teachingFocus) {
          this.$message("教学重点不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.teachingNodus) {
          this.$message("教学难点不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.teachingProcess) {
          this.$message("教学过程不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.assignmentAssignments) {
          this.$message("作业布置不能为空", "error");
          return true;
        }
        if (!this.addEditInfo.boardBookDesign) {
          this.$message("板书设计不能为空", "error");
          return true;
        }
      } else if (manner === 1) {
        if (!this.addEditInfo.templatePath) {
          this.$message("教案未上传", "error");
          return true;
        }
      }
    },
    uploadFile() {

    },
    downloadTemplateFile() {

    },
    // 移除文件
    handleRemove(file, fileList) {
      if (fileList.length == 0) {
        this.teachingFileIds = [];
      }
    },
    // 文件数量限制
    handleExceed(files, fileList) {
      this.$message(`当前限制选择 5 个文件`, "error");
    },
    // 移除文件之前
    beforeRemove(file, fileList) {
      const max = 1024 * 1024; // 1M
      if (file.size / max > 50) {
        return true;
      } else {
        // return this.$confirm(`确定移除该文件吗？`, '删除提示', {
        // 	confirmButtonText: '确定',
        // 	cancelButtonText: '取消',
        // 	type: 'warning'
        // }).then(() => {
        if (file.percentage && file.percentage !== 100) {
          // 未上传成功取消请求
          this.$refs.edufileupload.abort();
          return true;
        }
        if (this.themeId) {
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
      if (
          file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        isJpg = true;
      } else {
        isJpg = false;
      }
      if (!isJpg) {
        this.$message("上传失败，文件格式错误", "error");
        return false;
      }
      const max = 1024 * 1024; // 1M
      if (file.size / max > 50) {
        this.$message("单个文件不得超过50M", "error");
        return false;
      }
    },
    // 上传文件的错误回调
    handleEduError(error, file, fileList) {
      let errorM = JSON.parse(error.message);
      this.$message(errorM.message, "error");
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
      this.$axios.post("/upload/deleteTeachingFile", {id: id}).then((res) => {
        if (res.code == 200) {
          this.teachingFileIds.forEach((item, index) => {
            if (item == id) {
              this.teachingFileIds.splice(index, 1);
            }
          });
        }
      });
    },
    //返回
    goBack() {
      this.$router.push('/lessonPlanAnalysis');
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" type="text/scss" scoped>
//@import "@wangeditor/editor/dist/css/style.css";

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

.content-wrap {
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 25px 60px;
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
    min-width: 900px;
    width: 100%;
    height: 100%;
  }
}

.item-scroll-line {
  width: 100%;
  float: left;
}

.item-wrap {
  display: flex;
  align-items: center;
  margin-top: 25px;

  em {
    color: #f64646;
  }

  p:first-child {
    width: 85px;
    height: 40px;
    line-height: 40px;
    // text-align: justify;
    color: #303133;
    font-size: 14px;
  }

  p:first-child:after {
    content: "";
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

.edufile {
  align-items: flex-start;

  p {
    height: 40px;
    line-height: 40px;
  }
}

.upload-wrap {
  height: 130px;
  width: 280px;

  textarea {
    height: 130px;
    width: 280px;
    border: solid #dcdfe6 1px;
    resize: none;
  }
}

.upload-box {
  align-items: start;

  .p1 {
    margin-right: 5px;
    line-height: 40px;
  }

  ::v-deep .el-upload-list {
    margin: -146px 0 0 25px;
    width: 227px;
  }
}

.width-input {
  width: 100%;
}

.upload-btn {
  width: 100px;
  height: 35px;
  margin: 10px 20px 10px 0;
}

.edit-btn {
  width: 160px;
  height: 40px;
  margin: 35px 0 60px 66px;
}

.err-notice {
  margin-left: 14px;
  color: #b3b6ba;
  font-size: 12px;

  &.err-color {
    color: #f64646;
  }
}

.itemType {
  float: left;
  padding-left: 10px;
  padding-bottom: 10px;

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

.upload-demo .el-upload-list {
  margin: -145px 0 0 15px;
  width: 250px;
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

::v-deep.edufile .el-icon-close-tip {
  display: none !important;
  right: -110px;
}

.upload-demo .el-upload-list__item-status-label {
  display: block;
}

#vp {
  display: none;
}

.w100 {
  width: 110px !important;
}

::v-deep .wrap-radio .el-radio {
  margin-right: 20px;
}

.elTag {
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.one-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  margin-left: 80px;
}

.el-upload-tip {
  font-size: 12px;
  color: gray;
  margin-top: 10px;
}
</style>

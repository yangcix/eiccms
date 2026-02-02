
<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 400px; overflow-y: hidden"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>
   
  <script>
// npm 安装
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: { Editor, Toolbar },
  props: {
    myHtml: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      html: "",
      toolbarConfig: {
        excludeKeys: [
          // 排除菜单组，写菜单组 key 的值即可
          // "group-video", //去掉视频
          'codeBlock'
        ],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          //配置上传图片
          uploadImage: {
            customUpload: this.uploadImg,
          },
          uploadVideo: {
            customUpload: this.uploadVideo,
          }
        },
      },
      mode: "default",
    };
  },
  created() {
    if (this.myHtml !== "") {
      this.html = this.myHtml;
      console.log(this.html,'ccccc')
    }
  },
  methods: {
    getVal() {
      //父组件获取子组件的值
      return this.html;
    },
    uploadVideo(file, insertFn){
      let formdata = new FormData()
      formdata.append('file', file)
      formdata.append('type', 1)
      this.$axios.post('/sys/help/img2Url',formdata).then(res => {
        if (res.code === 200) {
          insertFn(location.protocol + '//' + location.hostname + ':' + location.port + res.data);
        }
      })
    },
    //上传图片
    uploadImg(file, insertFn) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$axios.post('/sys/help/img2Url',formdata).then(res => {
        if (res.code === 200) {
          insertFn(res.data);
        }
      })
    },

    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.html = this.myHtml
    })
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
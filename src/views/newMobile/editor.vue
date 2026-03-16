<template lang="html">
  <div>
    <div id="edit"></div>
  </div>
</template>

<script>
//引入
import wangEditor from 'wangeditor'

export default {
  name: 'editoritem',
  data() {
    return {
      //这个为富文本编辑器
      editor: null,
      //这个为富文本的内容
      editorData: ''
    }
  },
  mounted() {
    //判断哪个id或者class的div为富文本编辑器
    const editor = new wangEditor(`#edit`)
    //设置自定义上传的图片为base64,根据需要更改
    editor.config.uploadImgShowBase64 = true
    //菜单,包括顺序
    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      // 'todo',
      'justify',
      'quote',
      'emoticon',
      'image',
      'video',
      'table',
      // 'code',
      'splitLine',
      'undo',
      'redo',
    ]
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
      console.log(this.editorData)
    }
    // 创建编辑器
    editor.create()
    this.editor = editor
  },
  beforeDestroy() {
    //vue需要的 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style scoped>
</style>
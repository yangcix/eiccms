<!--  -->
<template>
  <div>
    <webrtc-streamer :url="currentSingleUrl" options="rtptransport=tcp&timeout=60" width="860px" height="560px" notitle="null"></webrtc-streamer>
  </div>
</template>

<script>
import './webrtc-streamer-element'
export default {
  components: {},
  props:{
    currentSingleUrl:{
      type:null,
      default:''
    }
  },

  data () {
    return {
    };
  },

  computed: {},

  mounted() {},

  methods: {}
}

</script>
<style lang='less' scoped>
</style>
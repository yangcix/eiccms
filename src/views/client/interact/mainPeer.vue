<template>
  <div style="height: 100%;max-width:100%;margin: 0;position: relative;display: inline-block;">
    <video v-show="isLive == 1" :id="'video' + info.user_id"  playsInline muted controls style="max-width: 100%;height: 100%;padding: 0px;margin: 0px;"/>
    <video v-show="!isLive || isLive == 2" style="padding: 0px;margin: 0px;"/>
    <p v-if="isLive == 2" class="wait" style="z-index: 99">
      网络异常，正在加载中
    </p>
    <p
      v-if="isLive !== 1 && isLive !== 2"
      class="wait"
      style="z-index: 99"
    >
      {{ status | videoMsg }}
    </p>
    <audio :id="'audio' + info.user_id" autoPlay muted playsInline controls style="height: 0px;padding: 0px;margin: 0px;width: 100%;"/>
  </div>
</template>

<script>
	import { session } from "@/assets/js/utils";
  import Srs from '@/assets/js/srs.js';
  export default {
    name: "PeerView",
    props:{
      status:{
        type: Number,
      },
      info:{
        type:Object,
        default: null
      },
      url:{
        type: String,
        default: ''
      },
      isLive:{
        type: Number,
      },
      mutedFlag:{
        type: Number
      },
      isMe:{
        type: Number,
      },
    },
    computed:{
      getTrack(){
        return this.isLive
      },
      getMic(){
        return this.mutedFlag
      },
    },
    data(){
      return {
        sdk: null
      }
    },
    methods:{
      initData(){
        try{
          if(this.url && this.isLive && this.isLive == 1){
            console.log('this.url',this.url,this.isLive)
            let video = document.getElementById(('video'+ this.info.user_id))
            let audio = document.getElementById(('audio'+ this.info.user_id))
            const sdk = new Srs.SrsRtcPlayerAsync(this.info.user_id);
            sdk.play(this.url);
            setTimeout(() => {
              console.log(sdk.stream.getAudioTracks()[0],'sdkddd',sdk.stream.getVideoTracks()[0])
              const videoTrack = new MediaStream;
              videoTrack.addTrack(sdk.stream.getVideoTracks()[0]);
              this.$nextTick(() => {
              video.srcObject = videoTrack;
              video.play().catch((error) => console.warn('videoElem.play() failed:%o', error));
            })
            this.sdk = sdk
            this.$nextTick(() => {
              const audioTrack = new MediaStream;
              audioTrack.addTrack(sdk.stream.getAudioTracks()[0]);
              if(this.isMe == 1 || this.mutedFlag !== 2){
                audio.volume = 0
              }else{
                audio.volume = (session.get("sliderValue") !== null ? parseInt((session.get("sliderValue")* 100)) :100) / 100
              }
              audio.srcObject = audioTrack
              audio.play().catch((error) => {
              console.warn('AAA.play() failed:%o', error)
              this.$emit('openValue');
            });
            })
            }, 1000);
          }
        }catch (e) {
          console.log(e,'没有')
        }
      },
    },
    watch:{
      getTrack(newValue,oldValue){
        console.log('有人进来',newValue)
        if(newValue !== 1 && this.sdk !== null){
          this.sdk.close()
        }
        if(newValue != null) {
          this.initData();
        }
      },
      getMic(newValue,oldValue){
        console.log('麦变了',newValue)
        let arr = document.getElementById('audio'+ this.info.user_id);
        if(newValue == 2 && this.isMe !== 1) {
          console.log('开麦')
          arr.muted = false
          arr.volume = (session.get("sliderValue") !== null ? parseInt((session.get("sliderValue")* 100)) :100) / 100
        }else{
          console.log('进麦')
          arr.muted = true
        }
      },
    },
    mounted() {
      this.initData();
    },
    filters: {
      videoMsg(val) {
        let arr = ["等待老师进入中...", "", "等待老师授课中..."];
        return arr[val];
      },
    },
  }
</script>

<style scoped>
  .controls{
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    pointer-events: none;
  }
  .button{
    flex: 0 0 auto;
    margin: 4px;
    margin-left: 0;
    border-radius: 2px;
    pointer-events: auto;
    background-position: center;
    background-size: 75%;
    background-repeat: no-repeat;
    background-color: #ffffff;
    cursor: pointer;
    transition-property: opacity, background-color;
    transition-duration: 0.15s;
    width: 28px;
    height: 28px;
    opacity: 0.85;
  }
  .button_mic_on{
    background-image: url('../../../assets/img/icon_mic_black_on.svg');
  }
  .button_mic_off{
    background-image: url('../../../assets/img/icon_mic_white_unsupported.svg');
    background-color: #000000;
  }
  .button_mic_unsupported{
    background-image: url('../../../assets/img/icon_mic_white_off.svg');
    background-color: #d42241;
  }
  .button_webcam_on{
    background-image: url('../../../assets/img/icon_webcam_black_on.svg');
  }
  .button_webcam_off{
    background-image: url('../../../assets/img/icon_webcam_white_on.svg');
    background-color: #000000;
  }
  .button_webcam_unsupported{
    background-image: url('../../../assets/img/icon_webcam_white_unsupported.svg');
    background-color: #d42241;
  }
  .button_change_on{
    background-image: url('../../../assets/img/icon_change_webcam_black.svg');
  }
  .button_change_unsupported{
    background-image: url('../../../assets/img/icon_change_webcam_white_unsupported.svg');
    background-color: #d42241;
  }
  .button_share_on{
    background-image: url('../../../assets/img/icon_share_black_on.svg');
  }
  .button_share_off{
    background-image: url('../../../assets/img/icon_share_white_on.svg');
    background-color: #000000;
  }
  .button_share_unsupported{
    background-image: url('../../../assets/img/icon_share_white_unsupported.svg');
    background-color: #d42241;
  }
  .indicators{
    position: absolute;
    z-index: 10;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction:row;
    justify-content: flex-end;
    align-items: center;
  }
  .icon{
    flex: 0 0 auto;
    margin: 4px;
    margin-left: 0;
    width: 32px;
    height: 32px;
    background-position: center;
    background-size: 75%;
    background-repeat: no-repeat;
    transition-property: opacity;
    transition-duration: 0.15s;
    opacity: 0.85;
    background-color: #333333;
  }
  .mic-off{
    background-image: url('../../../assets/img/icon_remote_mic_white_off.svg');
  }
  .webcam-off{
    background-image: url('../../../assets/img/icon_remote_webcam_white_off.svg');
  }
  .wait {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 90%;
    text-align: center;
  }
</style>

<!-- testHardware -->
<template>
  <div id="tabStep">
    <div class="tabTitle">
      <ul class="tab">
        <li v-for="(item,index) in tabList" 
          :key="item.val" class="tabItem" 
          :class="[active == index ? 'active' : '',active >= index ? 'isover':'']" >
            <i :class="checkState(index)"></i> {{item.name}}</li>
      </ul>
    </div>
    
    <div class="stepContent">
      
      <div class="contentItem" v-show='active == 0'>
        <div class="selectTitle">摄像头选项</div>
        <el-select
          @change="start"
          v-model="value"
          placeholder="请选择视频设备">
          <el-option
            v-for="item in options"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId">
          </el-option>
        </el-select>

        <div class="video">
          <video id="video" autoplay=""  :class="isMirror ? 'isMirror':''"></video>
          <el-checkbox v-model="isMirror" class="checkBox">镜像</el-checkbox> 
        </div>
          
        <p class="tips">温馨提示:如果您无法看到视频,请按以下方式排查问题</p>
        <ul>
          <li class="tips">是否启动
            <span style="color:#F55C54;">Chrome Insecure origins treated as secure flag</span>并填入相应白名单，查看
            <span class="startTips" @click="startTips"> 启动指引</span>；</li>
          <li class="tips">1.若杀毒软件(如:360卫视,百度卫士,腾讯安全管家等) 弹出提示信息,请选择"允许"；</li>
          <li class="tips">2.确认摄像头连接并开启；</li>
          <li class="tips">3.如果摄像头仍然没有画面,换一个插口重新插入；</li>
          <li class="tips">4.请选择正确摄像头选项,选择禁用会导致摄像头不可用；</li>
          <li class="tips">5.请确认摄像头没有被其他程序占用；</li>
          <li class="tips">6.重启电脑；</li>
        </ul>
        
      </div>

      <div class="contentItem" v-show='active == 1'>
        <div class="selectTitle">扬声器选项</div>
        <el-select
          @change="changeAudioDestination"
          v-model="valueOut"
          placeholder="请选择扬声器设备">
          <el-option
            v-for="item in optionsOut"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId">
          </el-option>
        </el-select>
        <div class="ask">点击下方播放按钮,你能听到音乐嘛?</div>

        <div class="playBox">
          <span class="playOut">
            <span class="playIn" @click="playMusic(isplay)">
              <i class="el-icon-caret-right" v-show="isplay"></i>
              <i class="el-icon-video-pause" v-show="!isplay"></i>
            </span>
          </span>
          <div class="sound">
            <i class="el-icon-message-solid"></i>
            <el-slider v-model="soundNum" class="soundSlider" @input="changeSound"></el-slider>
          </div>
        </div>
        

        <audio id="audio"  controls ref="audio" style="display:none">
            <source src="../assets/audio/test.mp3" type="audio/mpeg">
            <source src="../assets/audio/test.mp3" type="audio/ogg">
        </audio>

        <p class="tips">温馨提示:如果您无法听见声音,请按以下方式排查问题</p>
        <ul>
          <li class="tips">1.若杀毒软件(如:360卫视,百度卫士,腾讯安全管家等) 弹出提示信息,请选择"允许"；</li>
          <li class="tips">2.确认扬声器连接并开启；</li>
          <li class="tips">3.确认耳机、扬声器音量已经调整到最大；</li>
          <li class="tips">4.请选择正确耳机、扬声器选项,选择禁用会导致耳机、扬声器不可用；</li>
          <li class="tips">5.请确认耳机、扬声器仍然没有声音，换一个插口重新插入耳机、扬声器；</li>
          <li class="tips">6.重启电脑；</li>
        </ul>
      </div>

      <div class="contentItem" v-show='active == 2'>
        <div class="selectTitle">麦克风选项</div>
        <el-select
          @change="start"
          v-model="valueIn"
          placeholder="请选择录音设备">
          <el-option
            v-for="item in optionsIn"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId">
          </el-option>
        </el-select>
        <div class="ask">对着麦克风从1数到10,您能听到自己的声音并且看到蓝色条滚动吗?</div>
        <div class="mic">
          <span class="micNum" v-for="i in micArray" :key="i" :class="isFlow >= i*10 ? 'micMax':''"></span>
        </div>
        <p class="tips">温馨提示:如果您无法看到蓝色滚动条,请按以下方式排查问题</p>
        <ul>
          <li class="tips">1.若杀毒软件(如:360卫视,百度卫士,腾讯安全管家等) 弹出提示信息,请选择"允许"；</li>
          <li class="tips">2.确认麦克风连接并开启；</li>
          <li class="tips">3.如果麦克风接口正确连接设备；</li>
          <li class="tips">4.请选择正确麦克风选项,选择禁用会导致麦克风不可用；</li>
          <li class="tips">5.如果麦克风仍然没有声音，换一个插口或麦克风；</li>
          <li class="tips">6.重启电脑；</li>
        </ul>
      </div>

      <div class="contentItem" v-show='active == 3'>
        <div class="testTitle">
          <span class="testName">检测项目</span>
          <span class="testName">检测详情</span>
          <span class="testName">检测结果</span>
        </div>
        <ul>
          <li class="testItem">
            <span class="testName">视频检测</span>
            <span class="testName">{{testResultList[0] == true ? '可以' : '不可以'}}看到视频</span>
            <span class="testName" :class="testResultList[0] == true ? 'yes' : 'no'">{{testResultList[0] == true ? '正常' : '异常'}} <i :class="testResultList[0] == true ? 'el-icon-success' : 'el-icon-warning'"></i></span></li>
          <li class="testItem">
            <span class="testName">扬声器检测</span>
            <span class="testName">{{testResultList[1] == true ? '可以' : '不可以'}}听到声音</span>
            <span class="testName" :class="testResultList[1] == true ? 'yes' : 'no'">{{testResultList[1] == true ? '正常' : '异常'}}<i :class="testResultList[1] == true ? 'el-icon-success' : 'el-icon-warning'"></i></span></li>
          <li class="testItem">
            <span class="testName">麦克风检测</span>
            <span class="testName">{{testResultList[2] == true ? '可以' : '不可以'}}看到波动</span>
            <span class="testName" :class="testResultList[2] == true ? 'yes' : 'no'">{{testResultList[2] == true ? '正常' : '异常'}}<i :class="testResultList[2] == true ? 'el-icon-success' : 'el-icon-warning'"></i></span></li>
          <li class="testItem">
            <span class="testName">浏览器检测</span>
            <span class="testName">{{testResultList[3] == true ? '是' : '不是'}}Chrome内核</span>
            <span class="testName" :class="testResultList[3] == true ? 'yes' : 'no'">{{testResultList[3] == true ? '正常' : '异常'}}<i :class="testResultList[3] == true ? 'el-icon-success' : 'el-icon-warning'"></i></span></li>
        </ul>
      </div>

      <div class="button">
        <el-button type="danger" round  @click="nextStepUn">{{active == 3 ? '重新检测' : '不可以'}}</el-button>
        <el-button type="primary" round  @click="nextStep" style="min-width:90px" :disabled="currentDidabled">{{active == 3 ? '进入互动' : '可以'}}</el-button>
        <el-button type="primary" round  @click="closeDialog" style="min-width:90px">取消</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import SoundMeter from '../assets/js/soundMeter'
export default {
  components: {},

  data () {
    return {
      active:0,  // 当前检测索引
      tabList:[
        {
          name:'视频检测',
          val:0
        },
        {
          name:'扬声器检测',
          val:1
        },
        {
          name:'麦克风检测',
          val:2
        },
        {
          name:'检测结果',
          val:3
        }
      ],  
      checkList:[2,2,2,2],  // 当前检测项状态数组
      testResultList:[], //检测结果数组
      isMirror:true,  // 是否镜像显示
      value:'',  // 当前视频设备值
      valueIn:'',  // 当前麦克风设备值
      valueOut:'',  //当前扬声器设备值
      options:[],  // 视频设备选择项
      optionsIn:[],// 麦克风设备选择项
      optionsOut:[],// 扬声器设备选择项
      videoElement:'', // 视频播放dom标签
      isChrome:false,  // 是否是isChrome
      soundNum:30, // 音量初始值显示
      isplay:true, // 控制播放
      micArray:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],  //麦克风动态显示数组
      meterRefresh:null, //麦克风动态显示刷新对象
      flow:0, // 麦克风动态值
      currentDidabled: false, // 按钮禁用
    };
  },

  computed: {
    isFlow() {
      return this.flow
    }
  },

  mounted() {
    this.testChrome();
    this.volumeInit();
  },

  methods: {
    // 音量初始化
    volumeInit() {
      this.$refs.audio.volume = 0.3
    },
    // 播放音频文件
    playMusic(isplay) {
      isplay ? this.$refs.audio.play() : this.$refs.audio.pause();
      this.isplay = !this.isplay
    },
    // 改变播放器音量
    changeSound () {
      this.$refs.audio.volume = this.soundNum/100;
    },
    // 可以 下一步/ 进入房间
    nextStep() {
      if(this.active < 3){
        this.checkList[this.active] = true
        this.active++;
        this.$refs.audio.pause();
        this.isplay = true;
        this.testResult();
      }else {
        // 触发父组件方法进入房间
        this.$emit('localJoinInRoom',this.testResultList)
      }
    },
    //不可以 / 重新检测
    nextStepUn() {
      if(this.active < 3){
        this.checkList[this.active] = false;
        this.active++;
        this.$refs.audio.pause();
        this.isplay = true;
        this.testResult();
      }else {
        this.active = 0
        this.checkList.forEach((item,index) => {
          this.checkList[index] = 2
        })
      }
    },
    closeDialog(){
      this.$emit('closeDialog');
    },
    // 检测结果
    testResult() {
      if(this.active == 3){
        this.testResultList = Object.assign([],this.checkList)
        this.testResultList[this.active] = this.isChrome;
      }
    },
    // 当前项状态icon
    checkState(index){
      if(this.checkList[index] == true){
        return 'el-icon-success success'
      }else if(this.checkList[index] == false){
        return 'el-icon-error error'
      }else if(this.checkList[index] == 2){
        switch(index){
          case 0:
            return 'el-icon-camera-solid'
          case 1:
            return 'el-icon-headset'
          case 2:
            return 'el-icon-mic'
          case 3:
            return 'el-icon-monitor'
        }
      }
    },

    // chrome浏览器检测
    testChrome() {
      this.isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
      if (this.isChrome) {
        this.isChrome = true;
        console.log("是Chrome浏览器");
        this.getMediaDevices();
      } else {
        this.isChrome = false;
        console.log("不是Chrome浏览器");
      }
    },
    // 获取媒体设备列表
    getMediaDevices(){
      if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log('menumerateDevices is not supported!');
      }else {
          let p = navigator.mediaDevices.enumerateDevices().then(this.gotDevices);   
          let _that = this
          p.then(() => {
            _that.value = _that.options[0].deviceId;
            _that.valueIn = _that.optionsIn[0].deviceId;
            _that.valueOut = _that.optionsOut[0].deviceId;
          }).then(() => {
            _that.start();
          });
          p.catch(this.handleError);
      }
    },
    // 遍历所有的设备，包括视频和音频设备,找到摄像头
    gotDevices(devices) {
      console.log(devices)
        let countV = 1;
        let countAIn = 1;
        let countAOut = 1;
        // 获取相机设备
        this.options = devices.filter(device => {
          if (device.kind === 'videoinput') {
            return device
          }
        }).map(device => {
          return {
            deviceId:device.deviceId,
            label:device.label || `相机 ${countV++}`
          }
        })
        // 获取录音设备
        this.optionsIn = devices.filter(device => {
          if (device.kind === 'audioinput') {
            return device
          }
        }).map(device => {
          return {
            deviceId:device.deviceId,
            label:device.label || `麦克风 ${countAIn++}`
          }
        })
        // 获取扬声器
        this.optionsOut = devices.filter(device => {
          if (device.kind === 'audiooutput') {
            return device
          }
        }).map(device => {
          return {
            deviceId:device.deviceId,
            label:device.label || `扬声器 ${countAOut++}`
          }
        })
    },
    start() {
      this.videoElement = document.getElementById("video");
      if (window.stream) {
        // 如果流存在,那就先清除/停止
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioContext = new AudioContext();
      } catch (e) {
        alert('Web Audio API not supported.');
      }
      const audioSource = this.valueIn;  // 配置 录音 源
      const videoSource = this.value;  // 配置 video源
      const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
      };
      navigator.mediaDevices.getUserMedia(constraints).then(this.gotStream).then(this.gotDevices).catch(this.handleError); // 执行
      
    },
    // 给视频元素 赋值流 并刷新设备列表
    gotStream(stream) {
      window.stream = stream; // make stream available to console  保存全局流信息

      this.videoElement.srcObject = stream;

      const soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
      let _that = this
      soundMeter.connectToSource(stream, function(e) {
        if (e) {
          alert(e);
          return;
        }
        _that.meterRefresh = setInterval(() => {
          // console.log(soundMeter.slow)
          _that.flow = Number(soundMeter.instant.toFixed(2)*2000);
          // slowMeter.value = slowValueDisplay.innerText =
          //   soundMeter.slow.toFixed(2);
          // clipMeter.value = clipValueDisplay.innerText =
          //   soundMeter.clip;
        }, 500);
      });
      
      // Refresh button list in case labels have become available  刷新设备列表以保证可用
      return navigator.mediaDevices.enumerateDevices();
    },
    // 获取媒体设备错误处理
    handleError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    },

    // 改变音频输出的目标
    changeAudioDestination() {
      const audioDestination = this.valueOut;
      this.attachSinkId(this.videoElement, audioDestination);  // 音频附加到视频元素上
    },

    // 使用设备/接收器ID将音频输出设备连接到视频元素
    attachSinkId(element, sinkId) {
      if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
            .then(() => {
              console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch(error => {
              let errorMessage = error;
              if (error.name === 'SecurityError') {
                errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
              }
              console.error(errorMessage);
              // 错误后选择默认的设备
              this.valueOut = this.optionsOut[0].deviceId;
              // audioOutputSelect.selectedIndex = 0;
            });
      } else {
        console.warn('Browser does not support output device selection.');
      }
    },

    startTips(){
      this.$emit('startTips')
    }
  }
}

</script>
<style lang='scss' scoped>
#tabStep{
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 700px;
  height: 500px;
  background:#FFF;
  border-radius: 15px;
  margin: 0 auto;
  padding: 0 0 30px 0;
  z-index: 2;

  .tabTitle {
    height: 54px;
    line-height: 53px;
    box-shadow: -1px 2px 2px -2px rgba(0, 0, 0,  0.2);
    padding: 0 30px;
    box-sizing: border-box;
    .tab {
      display: flex;
      justify-content: space-between;
      .tabItem {
        width: 100px;
        text-align: center;
        color: #848493;
        font-size: 15px;
      }
      .active {
        border-bottom:2px #232325 solid;
        
      }
      .success {
        color: #11C879;
      }
      .error {
        color: #F55C54;
      }
      .isover {
        color: #232325;
        font-weight: 600;
      }
    }
  }

  .stepContent {
    height: 448px;
    padding: 30px 50px 0 50px ;
    position: relative;
    .contentItem {
      .selectTitle{
        margin-bottom: 10px;
        color: #848493;
        font-size: 12px;
      }
      .video {
        margin: 20px 0;
        video {
          height:130px;
          border-radius:10px;
        }
        .isMirror {
          transform: rotateY(180deg);
        }
        .checkBox {
          margin:0 20px;
        }
      }
      


      .testTitle {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #BCB8B1;
        height: 46px;
        line-height: 46px;
      }
      .testItem {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        height: 55px;
        line-height: 55px;
        margin-bottom: 10px;
        background:#F6F6F6;
        border-radius: 8px;
        .yes {
          color: #11C879;
        }
        .no {
          color: #F55C54;
        }
      }
      .testName {
        min-width: 100px;
        text-align: center;
      }
    } 
    
    .ask {
      font-size: 14px;
      margin: 20px 0;
    }
    
    .mic {
      width: 100%;
      height: 50px;
      margin-bottom:26px;
      line-height: 64px;
      background: #F6F6F6;
      border-radius: 8px;
      text-align: center;
      transition: all 0.5s;
      .micNum {
        display: inline-block;
        width: 6px;
        height: 24px;
        border-radius: 4px;
        background: #E4E4E4;
        margin: 0 6px;  
      }
      .micMax {
          background: #409EFF;
          opacity: 1;
        }
    }

    .playBox {
      height: 80px;
      line-height: 80px;
      margin-bottom: 20px;
      position: relative;
      .playOut {
        display:inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #b3d1ee;
        position: relative;
        transition: all 0.6s;

        .playIn {
          display:inline-block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #409EFF;
          position: absolute;
          top:50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
        .el-icon-caret-right ,.el-icon-video-pause {
          font-size: 40px;
          color: #FFF;
          position: absolute;
          top:50%;
          left: 50%;
          transform: translate(-50%,-50%);
          cursor: pointer;
        }
      }

      .sound {
        display: inline-block;
        padding-left: 12px;
        width: 480px;
        height: 38px;
        line-height: 38px;
        top:20px;
        position: absolute;
        .soundSlider {
          width:450px;
          float:right;
        }
      }
    }
    

    

    .tips {
      color: #848493;
      font-size: 12px;
      margin-bottom: 4px;
      .startTips {
        color:#F55C54;
        cursor: pointer;
        text-decoration:underline;
      }
    }

    .button {
      width: 580px;
      position: absolute;
      bottom:30px;
      display: flex;
      justify-content: flex-end;
    }
    
  }

  .el-select {
    width: 100% !important;
  }
}
</style>
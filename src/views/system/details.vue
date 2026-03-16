<template>
  <div class="box">
    <div class="header"></div>
    <div class="boxContent">
      <div class="content-left">
        <div class="content-left-top">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>平台大数据</span></div>
            <img :src="icon2" alt="" />
          </div>
          <div class="center">
            <div class="item">
              <div class="imgBox"><img :src="icon3" alt="" /></div>
              <div>
                <p class="p1">开课总数</p>
                <p class="p2">{{allData.platform && allData.platform.countnum ? allData.platform.countnum :
                '0'}}<span>节</span></p>
              </div>
            </div>
            <div class="item">
              <div class="imgBox"><img :src="icon4" alt="" /></div>
              <div>
                <p class="p1">浏览次数</p>
                <p class="p2">{{allData.platform && allData.platform.pagenum ? allData.platform.pagenum :
                '0'}}<span>次</span></p>
              </div>
            </div>
            <div class="item">
              <div class="imgBox"><img :src="icon5" alt="" /></div>
              <div>
                <p class="p1">学习次数</p>
                <p class="p2">{{allData.platform && allData.platform.videonum ? allData.platform.videonum :
                '0'}}<span>次</span></p>
              </div>
            </div>
            <div class="item">
              <div class="imgBox"><img :src="icon6" alt="" /></div>
              <div>
                <p class="p1">覆盖学生</p>
                <p class="p2">{{allData.platform && allData.platform.studentnum ? allData.platform.studentnum :
                '0'}}<span>人</span></p>
              </div>
            </div>
            <div class="item">
              <div class="imgBox"><img :src="icon7" alt="" /></div>
              <div>
                <p class="p1">覆盖教师</p>
                <p class="p2">{{allData.platform && allData.platform.teachernum ? allData.platform.teachernum :
                '0'}}<span>人</span></p>
              </div>
            </div>
            <div class="item">
              <div class="imgBox"><img :src="icon8" alt="" /></div>
              <div>
                <p class="p1">覆盖学校</p>
                <p class="p2">{{allData.platform && allData.platform.schoolnum ? allData.platform.schoolnum :
                '0'}}<span>所</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="content-left-middle">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>学习次数统计</span></div>
            <img :src="icon2" alt="" />
          </div>
          <el-checkbox-group class="allcheck" v-model="checkboxGroups" size="mini" @change="changeAll">
            <el-checkbox-button label="总数">总数
            </el-checkbox-button>
          </el-checkbox-group>
          <el-checkbox-group class="itemcheck" v-model="checkboxGroup" size="mini" @change="changeNum">
            <el-checkbox-button v-for="(item, index) in options" :label="item.name" :key="index">{{ item.name }}
            </el-checkbox-button>
          </el-checkbox-group>
          <div class="content">
            <div class="chart-options">
              <p class="video-space" style="font-size: 13px;">学习次数(次)</p>
              <div>
                <p style="font-size: 13px;">时间颗粒：</p>
                <el-select v-model="time" class="width-4" @change="timeChange" size="mini">
                  <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.type">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="statistics-wrap">
              <div id="detailMain"></div>
            </div>
          </div>
        </div>
        <div class="content-left-footer">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>平台资源分析</span></div>
            <img :src="icon2" alt="" />
          </div>
          <p class="total">资源总数: <span>{{allData.resource && allData.resource.allCount ? allData.resource.allCount :
          '0'}} 个</span></p>
          <div class="statistics-wrap">
            <div id="detailMains"></div>
          </div>
        </div>
      </div>
      <div class="content-middle">
        <div class="header">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>专递课堂</span></div>
            <img :src="icon2" alt="" />
          </div>
          <div class="content">
            <div class="item">
              <p class="one">已开课</p>
              <p class="two">{{allData.express && allData.express.coursenum ? allData.express.coursenum :
              '0'}}<span>节</span></p>
            </div>
            <div class="item">
              <p class="one">已结对</p>
              <p class="three">{{allData.express && allData.express.linknum ? allData.express.linknum :
              '0'}}<span>对</span></p>
            </div>
            <div class="item">
              <p class="one">常态化课程</p>
              <p class="two">{{allData.express && allData.express.habitusnum ? allData.express.habitusnum :
              '0'}}<span>套</span></p>
            </div>
            <div class="item">
              <p class="one">受益学生</p>
              <p class="four">{{allData.express && allData.express.benefitnum ? allData.express.benefitnum :
              '0'}}<span>人次</span></p>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="baiduMap" id="mapShow" ref="mapShow"></div>
        </div>
        <div class="footer">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>最新专递课堂进度</span></div>
            <img :src="icon2" alt="" />
          </div>
          <div class="itemList" @mouseover="mouseOver" @mouseout="mouseOut">
            <div id="con1" ref="con1" :class="{ anim: animate == true }">
              <div v-for="(item, index) in allData.rate" :key="index" class="item" >
              <img :src="icon9" alt="">
              <div class="item-item">
                <div class="left">
                  <div class="itemBox" v-if="item.type == 1">
                    <div v-if="item.status == 1">
                      开设【<span :title="item.name">{{item.name}}</span>】互动课堂
                    </div>
                    <div v-else-if="item.status == 2">
                      【<span :title="item.name">{{item.name}}</span>】互动课堂授课中
                    </div>
                    <div v-else-if="item.status == 3">
                     【<span :title="item.name">{{item.name}}</span>】互动课堂已结束
                    </div>
                  </div>
                  <div v-else class="nowItemBox">
                    <div class="nowItem">第{{item.count}}节</div>
                    <div v-if="item.status == 1">
                      开设【<span :title="item.name">{{item.name}}</span>】常态化专递课堂
                    </div>
                    <div v-else-if="item.status == 2">
                      【<span :title="item.name">{{item.name}}</span>】常态化专递课堂授课中
                    </div>
                    <div v-else-if="item.status == 3">
                      【<span :title="item.name">{{item.name}}</span>】常态化专递课堂课程已结束
                    </div>
                  </div>
                  <div class="itemSchool" style="margin-top: 5px;">
                    <span :title="item.masterschool">{{item.masterschool}}</span>
                    <span :title="item.mastername" style="margin-left: 10px;">{{item.mastername}}</span>
                    <img :src="icon10" alt="">
                    <span :title="item.assistantschool">{{item.assistantschool}}</span>
                  </div>
                </div>
                <div class="date">
                  {{item.start_time}}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="header">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>智能研修</span></div>
            <img :src="icon2" alt="" />
          </div>
          <div class="statistics-wrap" style="height: 480px">
            <el-carousel style="width: 100%;height: 480px" arrow='never' interval='5000' :indicator-position="aistatus == 0 ? 'none' : ''">
              <el-carousel-item>
                <div class="title-label">
                  <div><span>听评课活动总数<span style="margin-left: 5px;color: #FAC454;">{{ allData.researcher && allData.researcher.commentTotal ? allData.researcher.commentTotal :
                  0}} 课</span></span></div>
                </div>
                <div id="rightMain"></div>
                <div class="center">
                <p>听评课活动排名/单位(课)</p>
                <div class="statistics-wrap">
                  <div id="rightMains"></div>
                </div>
              </div>
              </el-carousel-item>
              <el-carousel-item v-if="aistatus == 1">
                <div class="title-label">
                <div><span>AI磨课总数<span style="margin-left: 5px;color: #FAC454;">{{ allData.grinding && allData.grinding.commentTotal ? allData.grinding.commentTotal :
                0}} 课</span></span></div>
              </div>
                <div id="airightMain"></div>
                <div class="center">
                <p>AI磨课排名/单位(课)</p>
                <div class="statistics-wrap">
                  <div id="airightMains"></div>
                </div>
              </div>
              </el-carousel-item>
            </el-carousel>
            <!-- <div class="right" v-if="allData.researcher && allData.researcher.teacherData">
              <p>听评课活动排名(频次)</p>
              <div v-for="(item,index) in allData.researcher.teacherData" :key="index">
                <span style="width: 100px;">{{ item.name }}</span><span>{{ item.num }}节</span>
              </div>
            </div> -->
          </div>
          <!-- <div class="title-label-line">
          </div>
          <div class="center">
            <p>研修排名/单位(课)</p>
            <div class="statistics-wrap">
              <div id="rightMains"></div>
            </div>
          </div> -->
        </div>
        <div class="footer">
          <div class="title">
            <div><img :src="icon1" alt="" /><span>名师课堂</span></div>
            <img :src="icon2" alt="" />
          </div>
          <div class="title-label">
            <div><span>全区名师<span style="margin-left: 5px;color: #FAC454;">{{ allData.famous && allData.famous.data &&
            allData.famous.data.teachernum ? allData.famous.data.teachernum : 0}}人</span></span></div>
            <div><span>名师课堂数量<span style="margin-left: 5px;color: #FAC454;">{{ allData.famous && allData.famous.data &&
            allData.famous.data.classnum ? allData.famous.data.classnum : 0}}节</span></span></div>
            <div><span>学习总次数<span style="margin-left: 5px;color: #FAC454;">{{ allData.famous && allData.famous.data &&
            allData.famous.data.learnnum ? allData.famous.data.learnnum : 0}}次</span></span></div>
          </div>
          <div class="statistics-wrap">
            <div id="rightFooter"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import icon1 from "@/assets/imgs/frame1.png";
import icon2 from "@/assets/imgs/frame2.png";
import icon3 from "@/assets/imgs/frame3.png";
import icon4 from "@/assets/imgs/frame4.png";
import icon5 from "@/assets/imgs/frame5.png";
import icon6 from "@/assets/imgs/frame6.png";
import icon7 from "@/assets/imgs/frame7.png";
import icon8 from "@/assets/imgs/frame8.png";
import icon9 from "@/assets/imgs/frame9.png";
import icon10 from "@/assets/imgs/frame10.png";
import icon11 from "@/assets/imgs/position.png";
import { all } from "q";
export default {
  name: "",
  data() {
    return {
      aistatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
      map: undefined,
      marker: undefined,
      icon1: icon1,
      icon2: icon2,
      icon3: icon3,
      icon4: icon4,
      icon5: icon5,
      icon6: icon6,
      icon7: icon7,
      icon8: icon8,
      icon9: icon9,
      icon10: icon10,
      icon11: icon11,
      checkboxGroup: ['专递课堂', '优质资源', '名师课堂', '课堂回顾', '课外知识', '智能研修', '停课不停学'],
      checkboxGroups: ['总数'],
      options: [
        {
          id: 1,
          name: "智能研修",
        },
        {
          id: 2,
          name: "课堂回顾",
        },
        {
          id: 3,
          name: "停课不停学",
        },
        {
          id: 4,
          name: "优质资源",
        },
        {
          id: 5,
          name: "专递课堂",
        },
        {
          id: 6,
          name: "课外知识",
        },
        {
          id: 7,
          name: "名师课堂",
        },
      ],
      time: 1,
      timeList: [
        { label: "近15日", type: 1 },
        { label: "近30日", type: 2 },
        { label: "近1年", type: 3 },
        { label: "近3年", type: 4 },
      ],
      timer: '',
      myCharts: "",
      allData: {},
      animate: false,
      numData: {},
    };
  },
  components: {},
  mounted() {
    this.getData();
  },
  methods: {
    scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => {
        //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.allData.rate.push(this.allData.rate[0]); // 将数组的第一个元素添加到数组的
        this.allData.rate.shift(); //删除数组的第一个元素
        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 1000);
    },
    mouseOver(){
      console.log('鼠标悬停')
      // this.animate = false;
      clearInterval(this.timer)
    },
    mouseOut(){
      // this.animate = true;
      if(this.allData.rate.length > 3){
        this.timer=setInterval(this.scroll, 5000);
      }
    },
    getData() {
      this.$axios.get('/sys/screen/allData').then(res => {
        this.allData = res.data;
        this.initVideoChart([]);
        this.initVideoCharts();
        this.initChart();
        this.initCharts();
        if(this.aistatus == 1){
          this.initChartai();
          this.aiinitCharts();
        }
        this.initChartss();
        this.baiduMap();
        this.changeAll();
        if(this.allData.rate.length > 3) {
          this.timer=setInterval(this.scroll, 5000);
        }
      });
    },
    changeAll() {
      if(this.checkboxGroups.length > 0) {
        this.checkboxGroup = ['专递课堂', '优质资源', '名师课堂', '课堂回顾', '课外知识', '智能研修', '停课不停学'];
        this.changeNum();
      }else{
        this.checkboxGroup = [];
        this.changeNum();
      }
    },
    changeNum() {
      this.numData = []
      if(this.checkboxGroup.length > 0){
        this.getNum().then(res => {
          if(res == 200){
            setTimeout(() => {
              let data = [];
              console.log(this.numData,'numData')
              this.numData.forEach(el => {
                data.push({
                  name: el.name,
                  type: 'line',
                  data: el.countY,
                  itemStyle: {
                    normal:{color: this.getColor(el.name)}
                  }
                })
              })
              this.$nextTick(() => {
                this.initVideoChart(data);
              })
            }, 300);
          }
        })
      }else{
        this.initVideoChart([])
      }
    },
    getColor(val) {
      switch(val){
        case '智能研修':
          return '#54A36F';
          break;
        case '课堂回顾':
          return '#E06567';
          break;
        case '停课不停学':
          return '#EE8450';
          break;
        case '优质资源':
          return '#9ACD70';
          break;
        case '专递课堂':
          return '#5C6EC8';
          break;
        case '课外知识':
          return '#83C0DF';
          break;
        case '名师课堂':
          return '#F2C951';
          break;
        default:
      }
    },
    getNum() {
      return new Promise((resolve, reject) => {
        let arr = [];
        for (let index = 0; index < this.checkboxGroup.length; index++) {
          const element = this.checkboxGroup[index];
          if((index + 1) == this.checkboxGroup.length) {
            this.$axios.get('/sys/screen/studyCount', { type: this.time, name: element }).then(res => {
              arr.push({
                name: element,
                countX: res.data.countX,
                countY: res.data.countY,
              })
              this.numData = arr;
              resolve(200)
            })
          }else{
            this.$axios.get('/sys/screen/studyCount', { type: this.time, name: element }).then(res => {
              arr.push({
                name: element,
                countX: res.data.countX,
                countY: res.data.countY,
              })
            })
          }
        }
      })
    },
    baiduMap() {
      var map = new BMapGL.Map("mapShow", {
        maxZoom: 15,
        minZoom: 9
      }); // 创建Map实例
      //初始化地图,设置中心点坐标和地图级别
      let val = JSON.parse(localStorage.getItem('mapVal'));
      map.centerAndZoom(
        new BMapGL.Point(val.lng, val.lat),
        13
      );
      //开启鼠标滚轮缩放
      map.enableScrollWheelZoom(true);
      // var navi3DCtrl = new BMapGL.NavigationControl3D(); // 添加3D控件
      // map.addControl(navi3DCtrl);
      // var scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
      // map.addControl(scaleCtrl);
      // var zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
      // map.addControl(zoomCtrl);
      map.setTilt(60);
      this.setData(map, this.initData());
      let datas = [];
      let datass = [];
      this.allData.map.forEach(el => {
         datass.push({
            name: el.mastername,
            lat: el.masterlatitude,
            lng: el.masterlongitude
          });
          datass.push({
            name: el.assistantname,
            lat: el.assistantlatitude,
            lng: el.assistantlongitude
          });
        if (el.status == 1) {
          datas.push({
            name: el.mastername,
            lat: el.masterlatitude,
            lng: el.masterlongitude
          });
          datas.push({
            name: el.assistantname,
            lat: el.assistantlatitude,
            lng: el.assistantlongitude
          });
        }
      })
      const strings = datass.map((item) => JSON.stringify(item));
      const removeDupList = [...new Set(strings)];
      const data = removeDupList.map((item) => JSON.parse(item));
      let icon1 = new BMapGL.Icon(icon11, new BMapGL.Size(22,28));
      data.forEach(el => {
        var point = new BMapGL.Point(el.lng, el.lat);
        var content = el.name;
        var label = new BMapGL.Label(content, {       // 创建文本标注
          position: point,                          // 设置标注的地理位置
          // offset: new BMapGL.Size(10, 20)           // 设置标注的偏移量
        })
        var marker = new BMapGL.Marker(point, {icon: icon1});
        map.addOverlay(label);
        map.addOverlay(marker);
      })
      map.setDisplayOptions({
        skyColors: ['rgba(186, 0, 255, 0)', 'rgba(186, 0, 255, 0)']//天空颜色
      })
      map.setMapStyleV2({ styleJson: stylejson });
      this.map = map;
    },
    initData() {
      // 数据源需要提供起点坐标和终点坐标
      let data = [];
      // 生成贝塞尔曲线坐标集
      // 1. 实例化贝塞尔曲线对象
      this.allData.map.forEach(el => {
        if (el.status == 1) {
          const curve = new mapvgl.BezierCurve();
          curve.setOptions({
            // start: [start.lng, start.lat],
            // end: [end.lng, end.lat],
            start: [el.masterlongitude, el.masterlatitude],
            end: [el.assistantlongitude, el.assistantlatitude]
          });
          // 3. 生成贝塞尔曲线坐标集
          let curveData = curve.getPoints();
          data.push({
            geometry: {
              type: "LineString", // 飞线
              coordinates: curveData, // 坐标系
            },
          });
        }
      });
      return data;
    },
    setData(map, data) {
      // 1. 初始化图层
      const view = new mapvgl.View({ map });
      // 2. 初始化飞线对象
      const flyLine = new mapvgl.FlyLineLayer({
        style: "chaos", // 样式，chaos是随机移动的意思
        color: 'rgba(146, 255, 254, 1)', // 底色
        step: 0.2, // 步长，也就是动画速度，值越大越快，默认0.1
        textureColor: "#92FFFE", // 线的颜色（运动的线）
        textureWidth: 50, // 飞线的宽度
        textureLength: 10, // 飞线的长度
      });
      // 3. 将飞线对象添加到图层中
      view.addLayer(flyLine);
      // 4. 将飞线对象与数据源进行绑定
      flyLine.setData(data);
    },
    //时间切换
    timeChange(val) {
      this.time = val;
      this.changeNum();
    },
    //初始化统计
    initVideoChart(data) {
      console.log(data,'dadda')
      if(this.myCharts !== ''){
        this.myCharts.clear();
      }
      this.myCharts = echarts.init(document.getElementById("detailMain"));
      this.myCharts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: "18",
          bottom: "30",
          left: '40',
          right: '40'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.numData[0] && this.numData[0].countX ? this.numData[0].countX : []
        },
        yAxis: {
          type: 'value'
        },
        series: data
      });
    },
    initVideoCharts() {
      var chartDom = document.getElementById("detailMains");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let size = this.allData.resource.name.length;
      for (let i = 0; i < size; i++) {
        let a = {};
        a.name = this.allData.resource.name[i];
        a.value = this.allData.resource.count[i];
        a.itemStyle = {color: this.getColor(a.name)}
        data.push(a);
      }
      console.log('ddd',data)
      option = {
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{b} : {c} ({d}%)",
        // },
        series: [
          {
            type: "pie",
            radius: [30, 80],
            center: ["50%", "50%"],
            itemStyle: {
              borderRadius: 2,
            },
            data: data,
            label: {
              normal: {
                show: true,
                formatter: '{b}{total|{c}}个',
                rich: {
                  total: {
                    color: '#FFFFFF',
                    padding: [0, 5]
                  }
                },
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              },
            }
          },
        ],
      };
      option && myChart.setOption(option);
    },
    initChart() {
      var chartDom = document.getElementById("rightMain");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let size = this.allData.researcher.schoolData.length;
      for (let i = 0; i < size; i++) {
        let a = {};
        a.name = this.allData.researcher.schoolData[i].schoolname;
        a.value = this.allData.researcher.schoolData[i].num;
        data.push(a);
      }
      option = {
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{b} : {c} ({d}%)",
        // },
        series: [
          {
            type: "pie",
            radius: [30, 60],
            center: ["50%", "50%"],
            itemStyle: {
              borderRadius: 2,
            },
            data: data,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if(params.name.length > 10){
                    return params.name.substring(0,10) + "\n" + params.name.substring(10,params.name.length) + `{total|${params.value}}` + '课'
                  }else{
                    return params.name + `{total|${params.value}}` + ' 课 '
                  }
                },
                rich: {
                  total: {
                    color: '#FFFFFF',
                    padding: [0, 5]
                  }
                },
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              },
            }
          },
        ],
      };
      console.log('datadatadata',option)
      option && myChart.setOption(option);
    },
    initChartai() {
      var chartDom = document.getElementById("airightMain");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let size = this.allData.grinding.schoolData.length;
      for (let i = 0; i < size; i++) {
        let a = {};
        a.name = this.allData.grinding.schoolData[i].schoolname;
        a.value = this.allData.grinding.schoolData[i].num;
        data.push(a);
      }
      option = {
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{b} : {c} ({d}%)",
        // },
        series: [
          {
            type: "pie",
            radius: [30, 60],
            center: ["50%", "50%"],
            itemStyle: {
              borderRadius: 2,
            },
            data: data,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if(params.name.length > 10){
                    return params.name.substring(0,10) + "\n" + params.name.substring(10,params.name.length) + `{total|${params.value}}` + '课'
                  }else{
                    return params.name + `{total|${params.value}}` + ' 课 '
                  }
                },
                rich: {
                  total: {
                    color: '#FFFFFF',
                    padding: [0, 5]
                  }
                },
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              },
            }
          },
        ],
      };
      console.log('datadatadata',option)
      option && myChart.setOption(option);
    },
    initCharts() {
      var chartDom = document.getElementById("rightMains");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let datas = [];
      this.allData.researcher.teacherData.forEach((el, index) => {
        if (index == 0) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#FFD749' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#FFD749' } }, itemStyle: { color: '#FFD749' }
          })
        } else if (index == 1) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#00F7FF' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#00F7FF' } }, itemStyle: { color: '#00F7FF' }
          })
        } else if (index == 2) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#50A5FF' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#50A5FF' } }, itemStyle: { color: '#50A5FF' }
          })
        } else {
          data.unshift({
            value: el.name,
            textStyle: { color: '#C6D8EB' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#C6D8EB' } }, itemStyle: { color: '#C6D8EB' }
          })
        }

      })
      console.log(data,'datas',datas)
      option = {
        yAxis: {
          type: 'category',
          data: data,
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var res = value;
              if(res.length > 5) {
                  res = res.substring(0, 5);
              }
              var str = res.split(",");
              return str;
            },
            textStyle: {
                fontSize: 12,
                color: '#ccc'
            },
          },
        },
        grid: {
          top: '20',
          left: '70',
          bottom: '100'
        },
        // title: {
        //   subtext: "单位（个）",
        //   left: 24,// 距离左边位置
        //   top: 16,// 距离上面位置
        //   subtextStyle:{ // 设置二级标题的样式
        //     color:"#baf"
        //   }
        // },
        label: {
          show: true, // 是否显示标签。
          position: 'right', // 标签位置
        },
        xAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            barWidth: 15,
            data: datas,
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
    },
    aiinitCharts() {
      var chartDom = document.getElementById("airightMains");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let datas = [];
      this.allData.grinding.teacherData.forEach((el, index) => {
        if (index == 0) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#FFD749' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#FFD749' } }, itemStyle: { color: '#FFD749' }
          })
        } else if (index == 1) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#00F7FF' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#00F7FF' } }, itemStyle: { color: '#00F7FF' }
          })
        } else if (index == 2) {
          data.unshift({
            value: el.name,
            textStyle: { color: '#50A5FF' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#50A5FF' } }, itemStyle: { color: '#50A5FF' }
          })
        } else {
          data.unshift({
            value: el.name,
            textStyle: { color: '#C6D8EB' }
          })
          datas.unshift({
            value: el.num,
            label: { textStyle: { color: '#C6D8EB' } }, itemStyle: { color: '#C6D8EB' }
          })
        }

      })
      console.log(data,'datas',datas)
      option = {
        yAxis: {
          type: 'category',
          data: data,
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var res = value;
              if(res.length > 5) {
                  res = res.substring(0, 5);
              }
              var str = res.split(",");
              return str;
            },
            textStyle: {
                fontSize: 12,
                color: '#ccc'
            },
          },
        },
        grid: {
          top: '20',
          left: '70',
          bottom: '100'
        },
        // title: {
        //   subtext: "单位（个）",
        //   left: 24,// 距离左边位置
        //   top: 16,// 距离上面位置
        //   subtextStyle:{ // 设置二级标题的样式
        //     color:"#baf"
        //   }
        // },
        label: {
          show: true, // 是否显示标签。
          position: 'right', // 标签位置
        },
        xAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            barWidth: 15,
            data: datas,
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
    },
    initChartss() {
      var chartDom = document.getElementById("rightFooter");
      var myChart = echarts.init(chartDom);
      var option;
      let data = [];
      let datas = [];
      this.allData.famous.name.forEach((el,index) => {
        if(index <=9) {
          data.push({
            value: el,
            textStyle: { color: '#C6D8EB' }
          })
        }
      })
      this.allData.famous.count.forEach((el,index) => {
        if(index <=9) {
          datas.push({
            value: el,
            label: { textStyle: { color: '#C6D8EB' } }
          })
        }
      })
      option = {
        xAxis: {
          // triggerEvent: true,
          type: 'category',
          data: data,
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var res = value;
              if(res.length > 5) {
                  res = res.substring(0, 5);
              }
              var str = res.split("");
              return str.join("\n");
            },
            textStyle: {
                fontSize: 12,
                color: '#ccc'
            },
          },
        },
        grid: {
          top: '30',
          bottom: '70',
          left: '0',
          right: '0'
        },
        label: {
          show: true, // 是否显示标签。
          position: 'top', // 标签位置
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            barWidth: 15,
            data: datas,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 1, 0, 0,
                  [
                    { offset: 1, color: '#6FFFFE' },
                    { offset: 0.3, color: '#6FFFFE' },
                    { offset: 0, color: '#49A0FF' }
                  ]
                )
              }
            },
            label: {
              normal: {
                show: true,
                formatter: '{total|{c}}节',
                rich: {
                  total: {
                    color: '#FFFFFF',
                    padding: [0, 5]
                  }
                },
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              },
            },
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
      // this.extension(myChart);
    },
    extension(chart2) {
      
      if(!document.getElementById("extension")) {
        var div = document.createElement('div');
        div.id = 'extension';
        div.style.display = 'block';
        document.body.appendChild(div);
      }
      var id = document.getElementById("extension");
      chart2.on('mouseover', function(params) {
        //注意这里，我是以Y轴显示内容过长为例，如果是x轴的话，需要改为xAxis
        if(params.componentType == "xAxis") {
            //设置悬浮文本的位置以及样式
            id.style.position = 'absolute';
            id.style.color = 'black';
            id.style.background = 'white';
            id.style.fontSize = '12px';
            id.style.padding = '5px';
            id.style.display = 'inline';
            id.textContent = params.value
          window.document.body.mousemove(function(event) {
            var xx = event.pageX - 10;
            var yy = event.pageY + 15;
            id.style.top = yy;
            id.style.left = xx;
          });
          }
        });
        chart2.on('mouseout', function(params) {
          //注意这里，我是以Y轴显示内容过长为例，如果是x轴的话，需要改为xAxis
        if(params.componentType == "xAxis") {
          id.style.display = 'none';
        }
      });
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 1920px;
  min-height: 920px;
  // height: 780px;
  background-size: cover;
  background-image: url("../../assets/imgs/bg.png");
  background-repeat: no-repeat;
}

.header {
  min-height: 84px;
  height: 9%;
}
.boxContent {
  height: 91%;
  .title {
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
    /* or 160% */
    letter-spacing: 1px;
    color: #ffffff;

    div {
      display: flex;
      align-items: center;
    }

    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      padding-left: 5px;
    }

    padding-right: 20px;
  }

  display: flex;
  justify-content: space-between;
  padding: 0 20px;

  .content-left {
    width: 520px;
    @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
    .content-left-top {
      animation-name: slide;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      .title {
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 32px;
        /* or 160% */
        letter-spacing: 1px;
        color: #ffffff;

        div {
          display: flex;
          align-items: center;
        }

        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          padding-left: 5px;
        }

        padding-right: 20px;
      }
      min-height: 180px;
      height: 20%;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;

      .center {
        padding: 5px 20px;

        .item {
          width: 138px;
          height: 70px;
          display: inline-flex;
          justify-content: left;
          align-items: center;

          .p1 {
            padding: 3px 6px;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            // line-height: 30px;
            color: #ffffff;
          }

          .p2 {
            padding: 3px 6px;
            font-style: normal;
            font-weight: 600;
            font-size: 22px;
            // line-height: 30px;
            /* identical to box height */
            color: #fdae2c;

            span {
              font-size: 14px;
              font-weight: 200;
            }
          }

          .imgBox {
            width: 20px;
            height: 20px;
            // background-image: url('../../assets/imgs/iconBox.png');
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .content-left-middle {
      animation-name: slide;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      margin: 20px 0;
      height: 35%;
      min-height: 303px;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;

       ::v-deep .el-checkbox-button {
        margin-left: 20px;
        margin-top: 10px;
      }

       ::v-deep .el-checkbox-button__inner {
        color: #cee6ff !important;
        background: #03539d !important;
        border: none;
        border-radius: 0;
      }

       ::v-deep .is-checked {
        .el-checkbox-button__inner {
          color: #eef6ff !important;
          background: #4196dc !important;
          box-shadow: none;
        }
      }
       ::v-deep .allcheck{
        display: inline-block;
        .el-checkbox-button__inner {
          width: 78px;
        }
      }
       ::v-deep .itemcheck{
        display: contents;
        width: 350px;
      }
      .content {
        flex-direction: column;

        p {
          color: #778ea9;
        }

        .chart-options {
          padding: 5px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          div {
            display: flex;
            justify-content: center;
            align-items: center;
          }

           ::v-deep .el-input--mini .el-input__inner {
            background: #0a5095;
            border: none;
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .statistics-wrap {
          width: 100%;

          #detailMain {
            width: 100%;
            height: 170px;
          }
        }
      }
    }

    .content-left-footer {
      animation-name: slide;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      margin: 20px 0;
      height: 30%;
      min-height: 260px;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;

      .total {
        text-align: right;
        font-size: 14px;
        color: #FFFFFF;
        opacity: 0.7;
        padding: 0 20px;

        span {
          font-size: 12px;
          color: #FAC454;
        }
      }

      .statistics-wrap {
        width: 100%;

        #detailMains {
          width: 100%;
          margin-top: 20px;
          height: 200px;
        }
      }
    }
  }

  .content-middle {
    width: 870px;
    min-width: 784px;
    @keyframes slidess {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(0);
      }
    }
    @keyframes slidesss {
      0% {
        transform: translateY(100%);
      }
      100% {
        transform: translateY(0);
      }
    }
    @keyframes slidessss {
      0% {
        transform: translateY(100%);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .header {
      animation-name: slidess;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      min-height: 180px;
      height: 20%;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;
      margin: 0 20px;

      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .item {
          margin-top: 30px;

          .one {
            font-weight: 600;
            font-size: 17px;
            color: #FFFFFF;
          }

          .two {
            margin-top: 20px;
            font-style: normal;
            font-weight: 700;
            font-size: 42px;
            background: linear-gradient(180deg, #FFFFFF 6.51%, #4088FF 99.18%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;

            span {
              font-weight: 400;
              font-size: 12px;
            }
          }

          .three {
            margin-top: 20px;
            font-style: normal;
            font-weight: 700;
            font-size: 42px;
            background: linear-gradient(180deg, #FFFFFF 0%, #2DD8D8 110.87%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;

            span {
              font-weight: 400;
              font-size: 12px;
            }
          }

          .four {
            margin-top: 20px;
            font-style: normal;
            font-weight: 700;
            font-size: 42px;
            background: linear-gradient(180deg, #FFFFFF 0%, #FF772B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;

            span {
              font-weight: 400;
              font-size: 12px;
            }
          }
        }
      }
    }

    .center {
      animation-name: slidessss;
      animation-duration: .8s;
      height: 40%;
      min-height: 313px;
      border-top: 1px solid #354c7c;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      margin: 20px;

      .baiduMap {
        width: 100%;
        height: 100%;
        background-image: none !important;
      }
    }

    .footer {
      animation-name: slidesss;
      animation-duration: .8s;
      height: 30%;
      min-height: 260px;
      border-top: 1px solid #354c7c;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      margin: 20px;
      padding: 5px;

      .itemList {
        margin-top: 20px;
        overflow: hidden;
        height: 220px;

        .item {
          margin-top: 17px;
          height: 55px;
          opacity: 0.8;
          border: 1.55385px solid #1FBCFF;
          background: rgba(13, 48, 123, 0.8);
          display: flex;
          align-items: center;
          padding: 0 20px;

          .item-item {
            margin-left: 15px;
            min-width: 500px;
            width: 650px;
            display: flex;
            justify-content: space-between;

            .nowItemBox {
              display: flex;
              // justify-content: center;
              align-items: center;
              margin: 3px 0;
              font-size: 12px;
              color: #FFFFFF;
              letter-spacing: 0.1em;
              div{
                display: flex;
              }
              span {
                max-width: 260px;
                color: #FDAE2C;
                overflow: hidden; /*超出部分隐藏*/
                text-overflow: ellipsis; /*超出部分省略号表示*/
                white-space: nowrap; /*强制单行显示*/
                display: inline-block;
              }
            }
            .itemBox{
              display: flex;
              // justify-content: center;
              align-items: center;
              margin: 3px 0;
              font-size: 12px;
              color: #FFFFFF;
              letter-spacing: 0.1em;
              div{
                display: flex;
              }
              span {
                max-width: 260px;
                color: #FDAE2C;
                overflow: hidden; /*超出部分隐藏*/
                text-overflow: ellipsis; /*超出部分省略号表示*/
                white-space: nowrap; /*强制单行显示*/
                display: inline-block;
              }
            }
            .nowItem {
              border-radius: 3px;
              margin-right: 5px;
              padding: 2px 5px 0 5px;
              background: #438AFF;
              color: #053076;
              font-size: 12px;
              letter-spacing: 0.1em;
            }

            .itemSchool {
              margin: 3px 0;
              font-size: 12px;
              color: #FFFFFF;
              letter-spacing: 0.1em;
              display: flex;
              align-items: center;
              span{
                max-width: 100px;
                overflow: hidden; /*超出部分隐藏*/
                text-overflow: ellipsis; /*超出部分省略号表示*/
                white-space: nowrap; /*强制单行显示*/
                display: inline-block;
              }
              img {
                margin: 0 10px;
              }
            }

            // .left {
            //   p {
            //     margin: 3px 0;
            //     font-size: 12px;
            //     color: #FFFFFF;
            //     letter-spacing: 0.1em;

            //     span {
            //       color: #FDAE2C;
            //     }
            //   }
            // }

            .date {
              color: #FFFFFF;
              opacity: 0.7;
              font-size: 14px;
            }
          }
        }
      }

      .itemList :first-child {
        margin: 0;
      }
    }
  }

  .content-right {
    width: 485px;
    @keyframes slides {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(0);
      }
    }
    .header {
      animation-name: slides;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      min-height: 510px;
      // height: 60%;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;

      // margin: 0 20px;
      .statistics-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
        #rightMain {
          
          width: 490px;
          height: 180px;
        }
        #airightMain {
          
          width: 490px;
          height: 180px;
        }
        .right{
          margin-right: 20px;
          p{
            font-size: 14px;
            color: #FFFFFF;
          }
          span{
            margin-top: 5px;
            display: inline-block;
            font-size: 12px;
            color: #FFFFFF;
          }
          div{
            width: 100%;
          }
        }
      }

      .title-label {
        opacity: 0.8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px 0 15px;

        div {
          padding: 8px;
          border-top: 1px solid #345694;
          border-bottom: 1px solid #345694;

          span {
            font-size: 14px;
            color: #FFFFFF;
          }
        }
      }

      .title-label-line {
        height: 1px;
        border-top: 1px solid #FFFFFF;
        opacity: 0.5;
        margin: 0 20px;
      }

      .center {
        padding: 10px 20px;

        p {
          font-size: 14px;
          color: #FFFFFF;
        }

        .statistics-wrap {
          width: 100%;

          #rightMains {
            width: 100%;
            height: 280px;
          }
          #airightMains {
            width: 100%;
            height: 280px;
          }
        }
      }
    }

    .footer {
      animation-name: slides;
      animation-duration: .8s;
      border-top: 1px solid #354c7c;
      // margin-top: 20px;
      // height: 30%;
      min-height: 330px;
      box-shadow: 0px 4px 4px rgba(2, 25, 44, 0.5);
      padding: 5px;

      .title-label {
        border-top: 1px solid #345694;
        border-bottom: 1px solid #345694;
        opacity: 0.8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 15px;
        margin-top: 10px;

        div {

          // padding: 8px;
          span {
            font-size: 13px;
            color: #FFFFFF;
          }
        }
      }

      .statistics-wrap {
        width: 100%;

        #rightFooter {
          width: 100%;
          height: 250px;
        }
      }
    }
  }
}
.anim {
  transition: all 1s;
  margin-top: -74px !important;
}
//  ::v-deep .el-scrollbar__wrap{
//   background: #0A5095 !important;
//   border: none;
//   color: rgba(255, 255, 255, 0.7);
// }
 ::v-deep .BMapLabel{
  border: none !important;
  padding: 5px !important;
  border-radius: 12px;
  background: none !important;
  color: yellow;
}
::v-deep .el-carousel__container{
  height: 480px;
}
</style>

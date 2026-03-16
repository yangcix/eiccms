<!-- recordHome -->
<template>
  <div class="content-main-wrap" id="recordHome">
    <p class="content-title">概览</p>
    <div class="main-wrap" v-loading="loading">
      <div v-if="rightHome == 1">
        <div id="classroomView" v-if="buildingList && buildingList.length != 0">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item
          :name="buildingitem.id" v-for="(buildingitem, bindex) in buildingList" :key="bindex">
            <template slot="title">
              <span class="buildName-title">{{isTrue == 1 ? buildingitem.orgName + ' — ' + buildingitem.name : buildingitem.name}}</span> <span class="totalState">
                {{`(${buildingitem.normalStatus == null ? 0 : buildingitem.normalStatus}间正常,${buildingitem.abnormalStatus == null ? 0 : buildingitem.abnormalStatus}间信号异常,${buildingitem.noDevice == null ? 0 : buildingitem.noDevice}间无设备)`}}</span>
            </template>

              <div class="building" >
                <div class="floor" v-for="(flooritem, findex) in buildingitem.floorList" :key="findex">
                  <div class="floor_num">{{flooritem.floorNumber}}层</div>
                  <ul class="floor_item">
                    <li v-for="(classItem, cindex) in flooritem.floorItem" :key="cindex" class="floor_item_li" :class="classItem.terminalStatus | classStateB ">
                      <div class="top_line" :class="classItem.terminalStatus | classState "></div>
                      <div class="li_content">
                        <div class="class_state">
                          <span class="state_dot" :class="classItem.terminalStatus | classState "></span>
                          <span>{{classItem.terminalStatus | stateText}}</span>
                        </div>
                        <div v-if="classItem.name">
                          <h3>{{classItem.name}}</h3>
                          <p @click="enterRoom(classItem,bindex)">进入</p>
                          <!-- <p v-if="classItem.terminalStatus == 0" @click="enterRoom(classItem,bindex)">进入</p> -->
                          <!-- <p v-if="classItem.terminalStatus == -1" @click="addDevice"><i class="el-icon-plus">添加设备</i></p> -->
                        </div>
                        <div class="li_add" v-else @click="AddClassRoom(bindex,findex,cindex)">
                          <i class="el-icon-plus" v-if="!isAdd && classItem.terminalStatus == -1">点击添加</i>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="null-data" v-else>
        <div class="null-box">
          <img src="../../../assets/imgs/home-null.png" alt="">
          <p>{{totalMsg}}</p>
        </div>
      </div>
      </div>
      <div v-else>
      <div class="null-data">
          <img src="../../../assets/imgs/home-null.png" alt="">
          <p>暂无访问权限</p>
        </div>
    </div>
    </div>
   
  </div>
</template>

<script>
import {  mapActions } from 'vuex';
// import { Loading } from 'element-ui';
export default {
  components: {},

  data () {
    return {
      rightHome: this.$store.state.rightHome,
      isTrue: 0,
      loading: false,
      totalMsg: '暂无教室数据，请添加教室后查看',
      activeNames: [],
      buildingList: [],
      addRoomValue: '', // 当前添加的教室名称
      isAdd:false, // 是否要添加
      // buildingList:[]

    };
  },

  computed: {
    oldRightHome() {
      return this.$store.state.rightHome
    }
  },
  watch: {
    oldRightHome: {
      handler(newVal, oldVal){
        this.rightHome = newVal
      },
      deep: true
    }
  },
  filters: {
    classState(terminalStatus) {
      switch(terminalStatus){
        case 1:
          return 'sNormal';
        case 0:
          return 'sError';
        case -1:
          return 'sNull';
        
      }
    },
    classStateB(terminalStatus) {
      switch(terminalStatus){
        case 1:
          return 'sNormalB';
        case 0:
          return 'sErrorB';
        case -1:
          return 'sNullB';
        
      }
    },
    stateText(terminalStatus) {
      switch(terminalStatus){
        case 1:
          return '正常';
        case 0:
          return '信号异常';
        case -1:
          return '无设备';
        
      }
    }
  },

  mounted() {
    this.getBuildingList();
  },

  methods: {
    ...mapActions({
        commitSysModule:'commitSysModule',
        commitClassInfo:'commitClassInfo'
      }),
    // 获取教学楼数据
			getBuildingList() {
        this.$axios.get('/index/getSchool').then(res => {
          if(res.data.length > 1) {
              this.isTrue = 1;
            }else{
              this.isTrue = 0;
            }
        })
        // let loadingTarget = document.querySelector('.main-wrap');
        // let loadingInstance = Loading.service({ target:loadingTarget,fullscreen: true });
				this.$axios.get('/sm/recordOverview/list').then(res => {
          if(res.code == -10000 && res.message == '您没有当前操作的权限,请联系管理员') {
            this.loading = false;
            this.totalMsg = '暂无访问权限！'
            return
          }
          // loadingInstance.close();
					let building = [] //临时教学楼数据
          if(res.data && res.data.length != 0){
            res.data.forEach((buildingItem,bIndex) => {
              let item = Object.assign({},buildingItem)
              item.classroom = {};
              building[bIndex]=item;  // 拷贝教学楼数据
          
              building[bIndex].floorList = [];  // 创建楼层数组字段

              if(buildingItem.floors && buildingItem.classrooms){

                for(let i=1;i<=buildingItem.floors;i++){  // 楼层循环

                  let item = {
                      floorNumber: i,
                      floorItem:[]
                  } 
                  building[bIndex].floorList.push(item);  //创建楼层项

                  for(let j=1;j<=buildingItem.classrooms;j++){ // 房间循环

                    if(buildingItem.classroom && buildingItem.classroom[`${i}_${j}`]){  // 查找已有房间数据

                      building[bIndex].floorList[i-1].floorItem.push(buildingItem.classroom[`${i}_${j}`])  //填入数据
                    }else {
                      // 空数据填入空数据
                      building[bIndex].floorList[i-1].floorItem.push({
                        name: "",
                        code:"",
                        className:"",
                        floorNumber:i,
                        classroomNumber: j,
                        teachingBuildingId:building[bIndex].id
                      } )
                    }
                  }
                }
              }
            })

              // 教室层升序
            building.forEach((buildingItem,bIndex) => {
              buildingItem.floorList.sort((a,b)=>{ return b.floorNumber-a.floorNumber})
            })

            this.buildingList = Object.assign([],building) // 拷贝数据 建立响应式数据
          }
          this.loading = false;
					// console.log(this.buildingList)
				}).catch( err => {
          // loadingInstance.close();
          this.loading = false;
        })
				
			},
    // 添加教室
    AddClassRoom() {
      this.isAdd = true;
      
    },
    // 展开楼层
    handleChange(val) {
        console.log(val);
    },
    
    // 进入教室房间
    enterRoom(classItem,bindex) {
      console.log('进入房间');
      let data = JSON.parse(JSON.stringify(classItem));
      data.bindex = bindex;
      this.commitClassInfo(data);
      this.$router.push(`/recordhomedetail?classId=${classItem.classId}&classroomId=${classItem.id}&bindex=${bindex}&terminalStatus=${classItem.terminalStatus}`)
    },

    // // 添加设备
    // addDevice() {
    //   this.commitSysModule(1); //修改系统类型
    //   this.$router.push('/sys/terminal')
    //   console.log('添加设备');
    // },

    // // 查看详情
    // viewError(classItem,bindex) {
    //   this.$router.push(`/recordhomedetail?classId=${classItem.classId}&classroomId=${classItem.id}&bindex=${bindex}&terminalStatus=${classItem.terminalStatus}`)
    //   console.log('查看详情');
    //   let data = JSON.parse(JSON.stringify(classItem));
    //   data.bindex = bindex;
    //   this.commitClassInfo(data);
    // },

  }
}

</script>
<style lang='scss' scoped>
  .content-main-wrap{
    background: none;
  }
  #recordHome{
    overflow: hidden;
    .main-wrap {
      // height: 692px;
      padding: 0;
      background: #F1F2F4;

      .null-data {
        width: 100%;
        height: 692px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        img{
            width: 600px;
            height: 250px;
          }
        p {
            padding-top: 20px;
            text-align: center;
            color: rgb(117, 112, 112);
          }
      }
    }
  }
  #recordHome {
    .buildName-title {
      font-size: 20px;
      font-weight: 400;
      line-height: 29px;
      color: #303133;
    }
    .totalState {
      font-size: 14px;
      color: #999999;
      padding-left: 10px;
    }
    
    .building {
      border-top: 1px #F1F2F4 solid;
      border-bottom: 1px #F1F2F4 solid;
      overflow: hidden;
			overflow-x: auto;

      .floor {
        white-space: nowrap;

        .floor_num {
          display: inline-block;
          width: 60px;
          height: 142px;
          line-height: 142px;
          text-align: center;
          color:#5B8CFF;
          font-size: 16px;
          font-weight: bold;
          vertical-align: -webkit-baseline-middle;
        }

        .floor_item {
          display: inline-block;
					white-space: nowrap;

          .sNormalB {
              background: #E9FFF7;
            }
            .sErrorB {
              background: #FFE4D8;
            }
            .sNullB {
              background: #F6F6F6;
            }
          .floor_item_li {
            width: 212px;
            height: 142px;
            border: 1px solid #F1F2F4;
            display: inline-block;
            vertical-align: -webkit-baseline-middle;
            
            
            .top_line {
              width: 100%;
              height: 11px;
            }

            .sNormal {
              background: #00B779;
            }
            .sError {
              background: #FF6302;
            }
            .sNull {
              background: #BBBBBB;
            }

            .li_content {
              // padding: 20px 0 30px 0;

              .class_state {
                padding: 12px 0;
                text-align: center;
                color: #333333;
                font-size: 14px;

                .state_dot {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  margin-right: 3px;
                }

                .sNormal {
                  background: #00B779;
                }
                .sError {
                  background: #FF6302;
                }
                .sNull {
                  background: #BBBBBB;
                }
              }

              h3 {
                text-align: center;
                color: #303133;
                font-size: 18px;
                font-weight: bold;
                margin:0;

                // .enterRoom {
                //   font-size: 12px;
                //   color: #379BFF;
                //   cursor: pointer;
                //   margin-left: 4px;
                // }
              }
              // .small {
              //   padding: 6px 0;
              //   font-size: 14px;
              // }
              p {
                text-align: center;
                font-size: 12px;
                margin-top: 12px;
                color: #379BFF;
                cursor: pointer;
              }

              .li_add {
                text-align: center;
                line-height: 80px;
                color: #379BFF;
                cursor: pointer;
              }
            }

            
          }

        }
      }

    }

    .building::-webkit-scrollbar {
        height: 12px !important;
        cursor: pointer;
    }
		.main-wrap::-webkit-scrollbar {
				width: 12px !important;
        cursor: pointer;
    }
  }
</style>
<style>
#recordHome .el-collapse-item__header {
  height: 95px;
  line-height: 95px;
  padding-left: 17px;
  font-size: 16px;
}
#recordHome .el-collapse-item {
  margin-bottom: 23px;
}
#recordHome .el-collapse-item:last-child{
  margin-bottom: 0px;
}
#recordHome .el-collapse-item__content {
  padding: 0;
}
</style>
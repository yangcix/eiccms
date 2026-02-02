<template>
<!--  <div class="">
    <div>
        Login successful! Redirecting... 跳转页
    </div>
  </div>-->
</template>

<script>
import {session, creatTree} from "@/assets/js/utils";
import {mapActions, mapState} from "vuex";
import MD5 from "js-md5";
export default {
  name: "",
  data() {
    return {
      loading: true,
      error: '',
      success: false,
      sysModule: 1,
      homeMenu: { url: "/sys/home", name: "概览" },
      menuUrl: `/auth/menu?type=-2`,
      userInfo: {},
      feeModel: JSON.parse(localStorage.getItem("sysInfo")) ? JSON.parse(localStorage.getItem("sysInfo")).feeModel : 1,
      aiConfigId: JSON.parse(localStorage.getItem("sysInfo")).aiConfigId,
      aiStatus: JSON.parse(localStorage.getItem("sysInfo")).aiOpenStatus,
      aiConfigType: JSON.parse(localStorage.getItem("sysInfo")).type,
      code: "",
      state: "",
    };
  },
  computed: {
    // ...mapState({
    //   sysModule: "sysModule",
    //   seeHome: "seeHome",
    //   rightHome: "rightHome",
    //   threeHome: "threeHome",
    // }),
  },
  mounted() {
    const router = this.$route.query;
    if (!router.appId) {
      this.$message("appId不能为空！","error")
      return
    }
    if (!router.appKey) {
      this.$message("appKey不能为空！","error")
      return
    }
    if (!router.code) {
      this.$message("code不能为空！","error")
      return;
    }
    if (!router.state) {
      this.$message("state不能为空！","error")
      return
    }
    this.login(router.appId, router.appKey, router.code, router.state);
  },
  methods: {
    ...mapActions({
      commitSysModule: "commitSysModule",
      commitSeeHome: 'commitSeeHome',
      commitRightHome: 'commitRightHome',
      commitThreeHome: 'commitThreeHome'
    }),
    // 登录并跳转磨课
    async login(appId,appKey,code,state){
      let formData = new FormData();
      formData.set("appId", appId);
      formData.set("appKey", appKey);
      formData.set("code", code);
      formData.set("state", state);
      await this.$axios.post('/index/saveNotExistUser', formData).then(res => {
        if (res.code === 200) {
          const params = {
            loginType: "web",
            account: res.data.account,
            // password: MD5(res.data.md5Password),
            password: res.data.md5Password,
            remember: false,
            type: 1
          };
          this.$axios.post('/auth/login', params).then(res => {
            if (res.code === 200) {
              session.remove("systemMenuList");
              window.localStorage.setItem('isAdmin', res.data.adminOrSuper);
              window.localStorage.setItem('userInfo', JSON.stringify(res.data));
              this.userInfo = res.data;
              this.commitSysModule(3); //修改系统类型
              this.changeMenu();
              this.$router.push("/aiGrinding?loginRedirect=0"); // 磨课
            }
          });
        } else {
          this.$message(res.message, "error")
        }
      });
    },
    //菜单点击
    selectMenu(val) {
      if (
          val.url == "/recordhome" ||
          val.url == "/sys/home" ||
          val.url == "/traininghome"
      ) {
        this.KeyIndex = [];
      }
      this.$router.push(val.url);
      this.pageName = val.name;
    },
    // 改变菜单
    changeMenu() {
      console.log("变了");
      this.menuList = [];
      session.remove("systemMenuList");
      let arr = [];
      let arrs = [];
      let isTrue = 0;
      let rightTrue = 0;
      let threeTrue = 0;
      console.log("this.menuUrl: ", this.menuUrl);
      this.$axios.get(this.menuUrl).then((res) => {
        res.data.forEach((ele) => {
          if (ele.id != "207" && ele.id != "205" && ele.id != "204") {
            if (ele.id == 1 && this.sysModule == 1) {
              isTrue = 1;
            }
            if (ele.id == 12240 && this.sysModule == 2) {
              rightTrue = 1;
            }
            if (ele.id == 12600 && this.sysModule == 3) {
              threeTrue = 1;
            }
            if (this.aiStatus == 1) {
              if (ele.id !== 1 && ele.id !== 12240 && ele.id !== 12600 && ele.id !== 9181) {
                if (this.aiConfigId == 1 && (ele.id == 13201 || ele.id == 13202)) {
                  console.log("this.aiConfigId: " + this.aiConfigId + " , id: " + ele.id);
                  return;
                }
                if(this.aiConfigId == 2 && this.aiConfigType == 2 && (ele.id == 13201 || ele.id == 13202)){
                  return;
                }
                arr.push(ele);
              }
            } else {
              if (
                  ele.id !== 12601 &&
                  ele.id !== 1 &&
                  ele.id !== 12240 &&
                  ele.id !== 12600 &&
                  ele.id !== 9181 &&
                  ele.id !== 12604 &&
                  ele.id !== 13201 &&
                  ele.id !== 13202
              ) {
                arr.push(ele);
              }
            }
          }
        });
        if (isTrue == 1) {
          this.commitSeeHome(1);
        } else {
          this.commitSeeHome(0);
        }
        if (rightTrue == 1) {
          this.commitRightHome(1);
        } else {
          this.commitRightHome(0);
        }
        if (threeTrue == 1) {
          this.commitThreeHome(1);
        } else {
          this.commitThreeHome(0);
        }
        if(this.userInfo.userId == 1){
          arrs = arr
        }else{
          arrs = arr.filter(el => {
            if(el.id !== 10205){
              return el
            }
          })
        }
        if(this.aiType == 1){
          arrs = arrs.filter(el => {
            if(el.id !== 12604){
              return el;
            }
          })
        }
        if(this.userInfo.userId == 1 || this.userInfo.userId == 2){
          if(this.feeModel == 2){
            arrs = arrs.filter(el => {
              if(el.id !== 13201){
                return el
              }
            })
          }
        }else {
          arrs = arrs.filter(el => {
            if(el.id !== 13201){
              return el
            }
          })
        }
        session.set("systemMenuList", creatTree(arrs));
        this.menuList = session.get("systemMenuList");
        console.log(" this.menuList:  ",  this.menuList);
        this.setDefaultMenu(this.menuList);
        if (
            ((isTrue == 0 && this.sysModule == 1) ||
                (rightTrue == 0 && this.sysModule == 2) ||
                (threeTrue == 0 && this.sysModule == 3))
            && this.$route.path !== '/aiConfig/Recharge'
            && this.$route.path !== '/sm/aiclassAddEdit'
            && this.$route.path !== '/sm/commentaddedit'
            && this.$route.path !== '/sm/largeUnitAddEdit'
            && this.$route.path !== '/sm/interactiveaddedit'
            && this.$route.path !== '/sm/themeaddedit'
            && this.$route.path !== '/sm/clip'
            && this.$route.path !== '/sys/terminal'
            && this.$route.path !== '/sys/system/trial'
        ) {
          console.log("this.menuList[0].children[0].url: ", this.menuList[0].children[0].url);
          this.$router.push(this.menuList[0].children[0].url);
        }
      });
    },
    setDefaultMenu(menuList) {
      // console.log(menuList,'menuList')
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].children) {
          for (let j = 0; j < menuList[i].children.length; j++) {
            if (menuList[i].children[j].url == this.$route.path) {
              this.pageName = menuList[i].children[j].name;
              // this.currentIndex = menuList[i].children[j].url ;
            }
          }
        }
      }
    },
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
</style>

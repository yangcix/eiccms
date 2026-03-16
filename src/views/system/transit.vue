<template>
  <div class="transit">
    
  </div>
</template>

<script>
import { session } from "@/assets/js/utils";
import MD5 from 'js-md5';
export default {
  name: "",
  data() {
    return {};
  },
  mounted() {
    const router = this.$route.query;
    const params = {
      loginType: "web",
      token: router.token
    };
    this.$axios.post('/auth/loginByToken', params).then(res => {
      if (res.code === 200) {
        session.remove("systemMenuList");
        res.data.password = MD5(router.password);
        window.localStorage.setItem('isAdmin', res.data.adminOrSuper);
				window.localStorage.setItem('userInfo', JSON.stringify(res.data));
        if (router.type === "1") {
          this.$router.push("/sm/interactiveaddedit?mode=1"); // 互动主题 ==> 课堂模式
        } else if(router.type === "3"){
          this.$router.push("/sm/aiclassAddEdit?type=3&mode=1");//磨课
        } else if(router.type === "4"){
          this.$router.push("/sm/commentaddedit?type=2&mode=1");//评课
        } else {
          this.$router.push("/sm/themeaddedit?mode=1"); // 录播直播远程教学
        }
      }
    });
  },
};
</script>
<style lang="scss" scoped>
</style>

import Vue from 'vue'

//分类
Vue.filter('orgType',function(val){
  let typeList = ['教育局', '学校', '部门'];
  return typeList[val - 1];
});
//启用1 禁用0 状态
Vue.filter('useStatus',function(val){
  let status = val == 0 ? '禁用' : '启用';
  return status;
});

//指令实例
Vue.directive('permission', {
  componentUpdated: (el, binding, vnode) => {
    if(!binding.value){
      el.remove()
    }
  }
})

Vue.directive('search', {
  bind: (el, binding, vnode) => {
    if(typeof binding.value === 'function'){
      el.onkeydown = (e) => { // 回车查询
        let event = e || window.event
          if(!event.shiftKey && event.keyCode == 13){
              event.cancelBubble=true;
              event.preventDefault();
              event.stopPropagation();
              binding.value();
          }
        }
    }
    
  }
})

Vue.mixin({
  methods: {
    creatPermit(arr){
      let res = {};
      arr.forEach(val => {
        res[val] = val;
      });
      return res;
    }
  }
});

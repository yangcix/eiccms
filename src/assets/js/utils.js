// export const baseUrl = 'http://211.eicc.com:8080'; // http://111.eicc.com:8080
// export const baseUrl = 'http://lj.eicc.com:8081';
// export const baseUrl = 'http://129.28.159.115/eiccms';
// export const baseUrl = location.protocol + '//' + location.hostname + ':' + location.port + '/eiccms'
// export const baseUrl = '/api'
export const baseUrl =  process.env.NODE_ENV === "production" ? location.protocol + '//' + location.hostname + ':' + location.port + '/eiccms':'/api'

// export const kickUrl = location.hostname;
// export const kickUrl = process.env.NODE_ENV === "production" ? `${location.hostname}/netty` : "192.168.164.59:8443"
export const kickUrl = process.env.NODE_ENV === "production" ? `${location.hostname}:8443/netty` : "192.168.164.59:8443"
// export const kickUrl = process.env.NODE_ENV === "production" ? `${location.hostname}/netty` : "192.168.164.59:8443"
// export const kickUrl = process.env.NODE_ENV === "production" ? `${location.hostname}/netty` : "192.168.190.75:8443"
//时间戳转日期  formatDate(date, 'yyyy-MM-dd hh:mm:ss');
export function formatDate (time, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!time) return ''
  var date = new Date(time);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
}

// 时间格式化对应格式
export function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}

// 时间格式化为标准中国时间val
export function formatterDate (date) {
  let getDate = new Date();
  // 拼装可转格式
  let val = getDate.getFullYear()+'-'+(getDate.getMonth()+1)+'-'+getDate.getDate()+' '+date
  let result = new Date(val);
  return result;
}

export const storage = {
  set(key, val){
    localStorage.setItem(key, val);
  },
  get(key){
    return localStorage.getItem(key);
  },
  remove(key){
    localStorage.removeItem(key);
  }
}

export const cookie = {
  //cookie设置过期时间，单位小时，默认七天
  // MDN说使用encodeURIComponent解码编码空格等特殊字符
  set(key, val, time = 168){
    var date = new Date();
    date.setTime(date.getTime() + time*3600*1000);
    document.cookie
      = key + "=" + encodeURIComponent(val) +";expires=" + date.toGMTString() + ';path=/';
  },
  get(key){
    var getCookie = document.cookie.replace(/[ ]/g,"");
    var arrCookie = getCookie.split(";")
    var res;
    for(var i = 0;i < arrCookie.length;i++){
      var arr = arrCookie[i].split("=");
      if(key == arr[0]){
        res = arr[1];
        break;
      }
    }
    return decodeURIComponent(res);
  },
  remove(key){
    this.set(key, '', -1);
  }
}

export const session = {
  set(key, val){
    val = JSON.stringify(val);
    sessionStorage.setItem(key, val);
  },
  get(key){
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove(key){
    sessionStorage.removeItem(key);
  }
}

//构建树数据
export function creatTree(data) {
  let cloneData = JSON.parse(JSON.stringify(data));
  return cloneData.filter(parent => {
    let branchArr = cloneData.filter(child => parent['id'] == child['parentId']);
    branchArr.length > 0 ? parent['children'] = branchArr : '';
    return parent['parentId'] == 0;
  });
}

export function creatYear() {
  let len = parseInt(new Date().getFullYear()) - 2000 + 2;
  let arr = [];
  for(let i = 0;i < len;i++){
    arr.push({value: 2000 + i, label: 2000 + i});
  }
  return arr
}

//倒计时
export function timeDown(time) {
  if(time < 0){
    return;
  };
  var hour = parseInt(time / 3600);
  var seconds = parseInt((time - hour * 3600) / 60);
  var minutes = Math.ceil(time - hour * 3600 - seconds * 60);
  function fillTime(val) {
    var str = val + '';
    return str.length == 1 ? '0' + val : val;
  };
  return  fillTime(hour) + ':' + fillTime(seconds) + ':' + fillTime(minutes);
}

//当前时间
export function getNowDate() {
  var date = new Date();
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day  = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  function fillTime(val) {
    return val = (val >= 0 && val <= 9) ? '0' + val : val;
  };
  var currentdate = year + '-' + fillTime(month) + '-' + fillTime(day) + " " + fillTime(hour) + ':' + fillTime(minutes) + ':' + fillTime(seconds);
  return currentdate;
}

//检测ie
export function IEVersion() {
  var userAgent = navigator.userAgent;
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if(isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if(fIEVersion == 7) {
      return 7;
    } else if(fIEVersion == 8) {
      return 8;
    } else if(fIEVersion == 9) {
      return 9;
    } else if(fIEVersion == 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if(isEdge) {
    return 'edge';//edge
  } else if(isIE11) {
    return 11; //IE11
  }else{
    return -1;//不是ie浏览器
  }
}

//检测是否移动端
export function judgeMobile() {
  return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
}

// 将blob对象转化为json（文件类型调用ajax 取后端的返回值做特殊处理）
export function fileToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = res => {
      const { result } = res.target // 得到字符串
      const data = JSON.parse(result) // 解析成json对象
      resolve(data)
    } // 成功回调
    reader.onerror = err => {
      reject(err)
    } // 失败回调
    reader.readAsText(new Blob([file]), 'utf-8') // 按照utf-8编码解析
  })
}
export function handleGetQueryString(name) { // 获取当前url参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
	var context = "";
	if (r != null) {
		context = r[2];
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined" ? "" : context;
	}
};
// 节流
export function throttle (func, wait) {
  let timeout = null
  return function () {
  const context = this
  const args = arguments
  if (!timeout) {
      timeout = setTimeout(() => {
      timeout = null
      func.apply(context, args)
    }, wait)
    }
  }
}
import Vue from 'vue'
//如果匹配返回false，不匹配返回true
Vue.prototype.$verify = {
	// 判断是否为空 {}，[],'','undefined','null',undefined,null
	isEmpty(v){
		if (v && typeof v === 'object') {
			return Object.keys(v).length === 0;
		}else if ((v && typeof v === 'number') || v === 0) {
			v = v.toString();
		}else if (v === undefined) {
			v = v + '';
		}else if (Array.isArray(v)) {
			return v.length === 0;
		}
		return v.replace(/\s+/g, '') === '' || v === 'undefined' || v === undefined || v === null || v === 'null';
	},
	isPositiveInteger(value) {
		return /^[1-9]\d*$/.test(value);
	},
	//数字
	num(v, min, max){
		let reg = /^[0-9]{1,100}$/;
		return !(typeof v === 'number') || !reg.test(v) || v >= max || v <= min;
	},
	//数字or字符串数字
	numStr(v, min, max){
		let reg = /^[0-9]{1,100}$/;
		return !reg.test(v) || v >= max || v <= min;
	},
	//大小写字母 数字
	letterNum(v, len){
		let reg = /^[0-9A-Za-z]{1,100}$/;
		return v == undefined || !reg.test(v) || v.length > len;
	},
	//大小写字母 数字 长度限制
	letterNumLen(v, min, max){
		let reg = /^[0-9A-Za-z]{1,100}$/;
		return v == undefined || !reg.test(v) || v.length > max || v.length < min;
	},
	//大小写字母 数字 -
	letterNum1(v, len){
		let reg = /^[0-9A-Za-z-]{1,100}$/;
		return v == undefined || !reg.test(v) || v.length > len;
	},
	//大小写字母 数字 ./:
	letterNum2(v, len){
		// let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
		let reg = /^[0-9A-Za-z./:]{1,100}$/;
		if(v && reg.test(v) && v.length <=len){
			return true
		}else {
			return false
		}
	},
	//大小写字母 数字 中文
	chLetterNum(v, len){
		// v = v.replace(/\s+/g,""); // 去除所有空格
		// v = v.trim(); // 去除首位空格
		let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
		v = v ? v : '';
		return v.length > len || !reg.test(v);
	},
	//IP校验
	ip(v){
		let reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
		return !reg.test(v);
	},
	
	//端口校验
	port(v){
		return isNaN(Number(v)) || v == undefined || v < 1|| v > 65535;
	},
	//端口校验
	ports(v){
		return isNaN(Number(v)) || v == undefined || v <= 0;
	},
	// 大小写字母数字中两种组合
	checkPW(val) {
		let reg = /^((([a-z])+([0-9])+)||(([0-9])+([a-z])+)||(([A-Z])+([0-9])+)||(([0-9])+([A-Z])+)||(([a-z])+([A-Z])+)||(([A-Z])+([a-z])+)){6,20}$/g;
		let reg2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/
		
		let a = reg.test(val);
		let b = reg2.test(val);
		if(a == true || b == true) {
			if(val.length >= 6 && val.length <= 20) {
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},
	// 字母或数字或二者组合
	checkNumEn(val, min, max) {
		let reg = /^(\d+|[a-zA-Z]+|[0-9a-zA-Z]+)$/;
		val = val ? val : '';
		return !(reg.test(val) && val.length>=min && val.length<=max);
	},
	// 大小写字母和数字和字符组合
	checkNumEn(val, min, max) {
		let reg = /^(\d+|[a-zA-Z]+|[0-9a-zA-Z]+)$/;
		val = val ? val : '';
		return !(reg.test(val) && val.length>=min && val.length<=max);
	},
	// 大小写字母，数字，特殊字符、组成
	checkNumEnChart(val, min, max) {
		let reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[:/!#@*&.])[a-zA-Z\d:/!#@*&.]*$/;
		val = val ? val : '';
		return !(reg.test(val) && val.length>=min && val.length<=max);
	},
	// 大写或者小写字母，数字，特殊字符、组成
	checkNumChartA(val, min, max) {
		let reg = /^([a-zA-Z])(?=.*?\d)(?=.*?[:/!#@*&.])[a-zA-Z\d:/!#@*&.]*$/;
		val = val ? val : '';
		return !(reg.test(val) && val.length>=min && val.length<=max);
	},
	// 验证url地址规则
	checkUrl(val) {
		let reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		let re = new RegExp(reg);
		val = val ? val : '';
		return (re.test(val))
	},
    checkMac(mac) {
        let reg = /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;
		return !reg.test(mac);
    }
}

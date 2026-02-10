import axios from 'axios';
export function setColumns(columns, props, isShow) {
    columns.forEach((item) => {
        if (props.includes(item.prop)) {
            item['isShow'] = isShow;
        }
    });
    return columns;
}
// 删掉二级空children属性，多出来的空children属性会在联级选择器多出一个暂无数据的面板
export function removeNullSubChildren(array) {
    array.forEach((item) => {
        item.children.forEach((ite) => {
            if (ite.children.length == 0) {
                delete ite.children;
            }
        });
    });
    return array;
}
export function closeDlg(that) {
    that.detailDlg.visible = false;
    // 重置数据
    Object.assign(that.$data, that.$options.data());
}
export function staticSelectChange(val, that, isFirstEnter) {
    that.pageInfo = {
        total: 0,
        size: 10,
        index: 1,
    };
    that.sortParams = {};
    // 清空排序条件
    // 修复如果当前列显示，并且进行排序操作，统计情况切换到其他模式该列不显示，参数不清空，传到后端会报错
    that.defaultParams['sortField'] = '';
    that.defaultParams['sorType'] = '';
    that.inputValue = '';
    that.tableData = [];
    if (isFirstEnter) {
        if (val == 1) {
            // 市级
            that.$refs.detailCount.setCityType();
            that.optionArray = that.allOptionArray;
        } else if (val == 2) {
            // 区县
            that.$refs.detailCount.setCountyType();
            that.optionArray = that.allOptionArray.filter((item) => item.value != 1);
        } else if (val == 5) {
            // 学校-默认选中教师
            that.$refs.detailCount.setSchoolType();
            that.optionArray = that.allOptionArray.filter((item) => item.value != 1 && item.value != 2);
        } else if (val == 6) {
            // 课程
            that.$refs.detailCount.setTeacherType();
            that.optionArray = that.allOptionArray.filter(
                (item) => item.value != 1 && item.value != 2 && item.value != 5
            );
        }
        that.initialValue = val;
    }
    // 学校 || 教师 || 课程 需要显示搜索框
    if (val == 2 || val == 5 || val == 6) {
        that.showInput = true;
        let str = '请输入';
        if (val == 2) {
            str += '学校名称';
        } else if (val == 5) {
            str += '教师名称';
        } else if (val == 6) {
            str += '课程名称';
        }
        that.inputPlaceholder = str;
    } else {
        that.showInput = false;
    }
    if (!that.isFirstEnter) {
        this.staticInputChange(that.inputValue, that);
    }
    that.operateColumns(val);
}
export function staticInputChange(val, that) {
    that.defaultParams['schoolName'] = '';
    that.defaultParams['teacherName'] = '';
    that.defaultParams['className'] = '';
    that.pageInfo = {
        total: 0,
        size: 10,
        index: 1,
    };
    if (that.selectValue == 2) {
        // 学校
        that.defaultParams['schoolName'] = val;
    } else if (that.selectValue == 5) {
        // 教师
        that.defaultParams['teacherName'] = val;
    } else if (that.selectValue == 6) {
        // 课程
        that.defaultParams['className'] = val;
    }
    that.getTableData();
}
export function getDlgTableData(params, url, that) {
    if (params) {
        that.defaultParams = params;
        that.isFirstEnter = false;
    }
    that.defaultParams = {...that.defaultParams, ...that.sortParams };
    that.defaultParams['pageNum'] = that.pageInfo.index;
    that.defaultParams['pageSize'] = that.pageInfo.size;
    that.defaultParams['countDimension'] = that.selectValue;
    that.$axios.get(url, that.defaultParams).then((res) => {
        that.tableData = res.data.pageList;
        that.pageInfo.total = res.data.total;
    });
}
export function clickRowLine(row, prop, that) {
    if (prop == 'regionPath') {
        // 跳转区县
        return { type: 'DISTRICT', id: row.regionId, name: row.regionPath };
    } else if (prop == 'schoolName') {
        return { type: 'SCHOOL', id: row.schoolId, name: row.schoolName, regionId: row.regionId };
    } else if (prop == 'teacherName') {
        return {
            type: 'USER',
            id: row.teacherId,
            schoolId: row.schoolId,
            name: row.teacherName,
            schoolName: row.schoolName,
        };
    } else if (prop == 'name') {
        if (that.selectValue == 1) {
            return { type: 'DISTRICT', id: row.regionId, name: row.name };
        } else if (that.selectValue == 2) {
            return { type: 'SCHOOL', id: row.schoolId, name: row.name, regionId: row.regionId };
        } else if (that.selectValue == 5) {
            return {
                type: 'USER',
                id: row.teacherId,
                schoolId: row.schoolId,
                name: row.name,
                schoolName: row.schoolName,
            };
        } else if (that.selectValue == 6) {
            if (prop == 'teacherName') {
                return {
                    type: 'USER',
                    id: row.teacherId,
                    schoolId: row.schoolId,
                    name: row.teacherName,
                    schoolName: row.schoolName,
                };
            } else if (prop == 'schoolName') {
                return { type: 'SCHOOL', id: row.schoolId, name: row.schoolName, regionId: row.regionId };
            } else if (prop == 'name') {
                if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                    window.open('/aiReport?id=' + row.courseId, '_blank');
                } else {
                    window.open(row.courseUrl, '_blank');
                }
                return;
            }
        }
    }
}
export function setColumnsOperate(val, that) {
    let hiddenColumnsArray = [];
    if (val == 2) {
        // 区县
        hiddenColumnsArray = ['regionPath'];
    } else if (val == 5) {
        // 学校
        hiddenColumnsArray = ['regionPath', 'schoolName'];
    } else if (val == 6) {
        // 课程
        hiddenColumnsArray = ['regionPath', 'schoolName', 'teacherName'];
    }
    return that.$comjs.setColumns(that.columns, hiddenColumnsArray, false);
}
export function exportTableData(url, data) {
    axios({
        method: 'post',
        url: url,
        data: data,
        responseType: 'blob',
    }).then(
        (res) => {
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;

            link.setAttribute('download', decodeURIComponent(res.headers.filename));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        (err) => {
            console.log(err);
            reject(err);
        }
    );
}
export function connectWS(fileName, formData, callback) {
    const wsUrl = 'ws://192.168.161.166:8081/link';
    const ws = new WebSocket(wsUrl);
    console.log('ws', ws, fileName);

    ws.onopen = () => {
        console.log('连接成功');
        // 核心：发送文件名绑定消息给后端
        ws.send(
            JSON.stringify({
                type: '20', // 对应后端枚举值
                body: fileName,
            })
        );
    };

    // 接收进度消息
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        console.log('收到msg：' + msg);
        if (msg.type === '20') {
            console.log(`文件【${fileName}】进度：${msg.body.progress}%`);
            callback(formData, msg.body);
        }
    };
}

// 关闭连接
export function closeWS() {
    ws && ws.close();
}

export function addMinutesByTimestamp(date, minutes) {
    const dateObj = date instanceof Date ? date : new Date(date);
    // 分钟转为毫秒：1分钟 = 60 * 1000 毫秒
    const milliseconds = minutes * 60 * 1000;
    return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
        .format(new Date(dateObj.getTime() + milliseconds))
        .replace(/\//g, '-')
        .replace(',', '');
}
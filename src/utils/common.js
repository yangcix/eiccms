import axios from 'axios';
const store = require('../store').default;
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
export function exportTableData(url, data, fileName) {
    axios({
        method: 'post',
        url: url,
        data: data,
        responseType: 'blob',
    }).then(
        (res) => {
            const blob = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        (err) => {
            console.log(err);
        }
    );
}

// 关闭连接
export function closeWS() {
    ws && ws.close();
}

export function addMinutesByTimestamp(startTime, durationMinutes) {
    // 判断是否包含日期信息
    const hasDate = /[-\/]/.test(startTime) || startTime.includes(' ');
    let startMoment;
    if (hasDate) {
        // 完整日期时间
        startMoment = new Date(startTime);
    } else {
        // 纯时间，拼接今天的日期
        const today = new Date().toDateString();
        startMoment = new Date(`${today} ${startTime}`);
    }
    // 添加时长（分钟转毫秒）
    const endMoment = new Date(startMoment.getTime() + durationMinutes * 60 * 1000);
    // 如果输入是纯时间，输出也返回纯时间
    if (!hasDate) {
        return endMoment.toTimeString().slice(0, 8);
    }
    // 否则返回完整格式
    const year = endMoment.getFullYear();
    const month = String(endMoment.getMonth() + 1).padStart(2, '0');
    const day = String(endMoment.getDate()).padStart(2, '0');
    const hours = String(endMoment.getHours()).padStart(2, '0');
    const minutes = String(endMoment.getMinutes()).padStart(2, '0');
    const seconds = String(endMoment.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function createDuraTionMin(startTime, endTime) {
    const supportedFormats = [
        (time) => new Date(time), // 标准格式
        (time) => new Date(`2000-01-01 ${time}`), // 只包含时间的格式
    ];

    let start = null;
    let end = null;

    // 尝试不同的格式
    for (const format of supportedFormats) {
        try {
            start = format(startTime);
            end = format(endTime);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                break;
            }
        } catch (e) {
            continue;
        }
    }
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('无法解析时间格式');
    }
    return Math.floor((end - start) / (1000 * 60));
}

export function updateAiUploadTable(formData, msg) {
    if (!msg) return;
    let updateData = {};
    if (msg.progress == 100) {
        updateData = {
            type: 'splice',
            detail: formData, // 视频id
        };
    } else {
        updateData = {
            type: 'update',
            fileName: msg.fileName,
            progress: msg.progress,
        };
    }
    store.dispatch('commitAiUploadTable', updateData);
}

export function formatValue(value) {
    if (value || value === 0 || value === '0') return value;
    else return '-';
}

export function getUseList(that, params) {
    if (!params) {
        that.useList = [];
        that.aiNum = 0;
        that.$set(that.addEditInfo, 'aiProjectId', '');
        return;
    }
    that.$axios.get('/aiAnalysisRecharge/quota', params).then((res) => {
        if (res.code == 200) {
            that.useList = res.data.options;
            that.aiNum = res.data.totalResidue;
            // 如果是暂存的情况下编辑
            if (that.isEdit && that.isTranslationPending) {
                // 原有的项目被使用了，就清空使用的项目id
                if (that.useList.length == 0) {
                    that.$set(that.addEditInfo, 'aiProjectId', '');
                } else {
                    const currentItem = that.useList.find((item) => item.allocationId === that.addEditInfo.aiProjectId);
                    if (!currentItem || currentItem.residueNum == 0) {
                        that.$set(that.addEditInfo, 'aiProjectId', '');
                    }
                }
            }
            // 不是编辑的情况下，有数据的话默认选中第一项
            if (!that.isEdit && that.useList.length != 0) {
                that.$set(that.addEditInfo, 'aiProjectId', that.useList[0].allocationId);
            }
        }
    });
}
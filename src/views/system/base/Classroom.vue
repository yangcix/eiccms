<template>
    <div class="content-main-wrap">
        <p class="content-title">教室管理</p>
        <div id="classroomMangement" v-if="buildingList && buildingList.length != 0">
            <div class="main-wrap">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item
                        :title="isTrue == 1 ? buildingitem.orgName + ' — ' + buildingitem.name : buildingitem.name"
                        :name="buildingitem.id"
                        v-for="(buildingitem, bindex) in buildingList"
                        :key="bindex"
                    >
                        <div class="building">
                            <div class="floor" v-for="(flooritem, findex) in buildingitem.floorList" :key="findex">
                                <div class="floor_num">{{ flooritem.floorNumber }}层</div>
                                <ul class="floor_item">
                                    <li
                                        v-for="(classItem, cindex) in flooritem.floorItem"
                                        :key="cindex"
                                        class="floor_item_li"
                                        :class="!classItem.name ? 'isnull' : ''"
                                        @dragstart="dragstart(bindex, findex, cindex, $event)"
                                        @dragend="dragend($event)"
                                        @drop="drop(bindex, findex, cindex, $event)"
                                        @dragover="dragover($event)"
                                        :draggable="isDrag"
                                    >
                                        <div v-if="classItem.name">
                                            <div v-if="!isEdit || currentInput != `${bindex}${findex}${cindex}`">
                                                <h3 :class="classItem.name && classItem.name.length > 7 ? 'small' : ''">
                                                    {{ classItem.name }}
                                                    <div class="edit">
                                                        <i
                                                            class="el-icon-edit-outline"
                                                            v-if="permission.update"
                                                            @click="editName(bindex, findex, cindex, classItem.name)"
                                                        ></i>
                                                        <i
                                                            class="el-icon-delete"
                                                            v-if="permission.delete"
                                                            @click="deleteClass(bindex, findex, cindex, classItem)"
                                                        ></i>
                                                    </div>
                                                </h3>
                                                <p>{{ classItem.className ? classItem.className : '空闲' }}</p>
                                            </div>
                                            <el-input
                                                class="inputNameEdit"
                                                v-model.trim="addRoomValue"
                                                placeholder="请输入教室名称"
                                                v-if="isEdit && currentInput == `${bindex}${findex}${cindex}`"
                                                @blur="commitAdd(bindex, findex, cindex)"
                                            ></el-input>
                                        </div>
                                        <div class="li_add" v-else @click="AddClassRoom(bindex, findex, cindex)">
                                            <i
                                                class="el-icon-plus"
                                                v-if="
                                                    (!isInput || currentInput != `${bindex}${findex}${cindex}`) &&
                                                    permission.save
                                                "
                                                >点击添加</i
                                            >
                                            <el-input
                                                :ref="'inputNameEdit_' + bindex + findex + cindex"
                                                class="inputName"
                                                v-model.trim="addRoomValues"
                                                placeholder="请输入教室名称"
                                                v-if="isInput && currentInput == `${bindex}${findex}${cindex}`"
                                                @blur="onblurs(bindex, findex, cindex)"
                                            ></el-input>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="null-data" v-else>
            <div class="null-box">
                <img src="../../../assets/imgs/home-null.png" alt="" />
                <p>暂无教室数据，请添加教室后查看</p>
            </div>
        </div>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该教室？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteClass()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            permission: [],
            isTrue: 0,
            activeNames: [],
            building: [],
            buildingList: [],
            moveBindex: null, // 将要移动bulding的索引
            targetB: null, // 目标bulding的索引
            moveFindex: null,
            targetF: null,
            moveCindex: null,
            bindex: null,
            findex: null,
            cindex: null,
            targetC: null,
            addRoomValues: '',
            addRoomValue: '', // 当前添加的教室名称
            isInput: false, // 是否要输入
            isEdit: false, // 是否是编辑
            currentInput: '', //当前输入的房间索引
            isDrag: true, // 是否允许拖拽
            deleteShow: false, // 删除
            deleteRow: '',
            currentInputEle: null, //当前输入框dom
        };
    },
    components: {},
    filters: {
        liwidth(length) {
            switch (length) {
                case 1:
                    return 'big';
                case 2:
                    return 'bigmid';
                case 3:
                    return 'mid';
                case 4:
                    return 'midsmall';
                case 5:
                    return 'small';
                case 6:
                    return 'smallmin';
            }
        },
    },
    mounted() {
        this.getBuildingList();
    },
    methods: {
        // 获取教学楼数据
        getBuildingList() {
            this.$axios.get('/index/getSchool').then((res) => {
                if (res.data.length > 1) {
                    this.isTrue = 1;
                } else {
                    this.isTrue = 0;
                }
            });
            let type = localStorage.getItem('sysModule') == 1 ? 0 : -1;
            this.$axios.get('/sys/classroom/list?type=' + type).then((res) => {
                this.permission = this.creatPermit(res.data.permit);
                let building = []; //临时教学楼数据
                res.data.resData.forEach((buildingItem, bIndex) => {
                    let item = Object.assign({}, buildingItem);
                    item.classroom = {};
                    building[bIndex] = item; // 拷贝教学楼数据

                    building[bIndex].floorList = []; // 创建楼层数组字段

                    if (buildingItem.floors && buildingItem.classrooms) {
                        for (let i = 1; i <= buildingItem.floors; i++) {
                            // 楼层循环

                            let item = {
                                floorNumber: i,
                                floorItem: [],
                            };
                            building[bIndex].floorList.push(item); //创建楼层项

                            for (let j = 1; j <= buildingItem.classrooms; j++) {
                                // 房间循环

                                if (buildingItem.classroom && buildingItem.classroom[`${i}_${j}`]) {
                                    // 查找已有房间数据

                                    building[bIndex].floorList[i - 1].floorItem.push(
                                        buildingItem.classroom[`${i}_${j}`]
                                    ); //填入数据
                                } else {
                                    // 空数据填入空数据
                                    building[bIndex].floorList[i - 1].floorItem.push({
                                        name: '',
                                        code: '',
                                        className: '',
                                        floorNumber: i,
                                        classroomNumber: j,
                                        teachingBuildingId: building[bIndex].id,
                                    });
                                }
                            }
                        }
                    }
                });

                // 教室层升序
                building.forEach((buildingItem, bIndex) => {
                    buildingItem.floorList.sort((a, b) => {
                        return b.floorNumber - a.floorNumber;
                    });
                });

                this.buildingList = Object.assign([], building); // 拷贝数据 建立响应式数据
            });
        },
        // 添加教室
        AddClassRoom(bindex, findex, cindex) {
            console.log('ddd', bindex, findex, cindex);
            if ((this.bindex !== bindex) | (this.findex !== findex) | (this.cindex !== cindex)) {
                this.addRoomValues = '';
            }
            this.isEdit = false;
            this.isInput = true;
            this.bindex = bindex;
            this.findex = findex;
            this.cindex = cindex;
            this.currentInput = `${bindex}${findex}${cindex}`;
            this.isDrag = false; // 禁止拖拽
            this.$nextTick(() => {
                this.currentInputEle = document.querySelector('.el-input__inner');
                // this.$refs[`inputNameEdit_${bindex}${findex}${cindex}`][0].focus();
                // this.currentInputEle.focus();
                const refKey = 'inputNameEdit_' + bindex + findex + cindex;
                if (this.$refs[refKey]) {
                    this.$refs[refKey][0].focus();
                }
                // 阻止页面滚动
                window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop);
                this.currentInputEle.onkeydown = (e) => {
                    // 回车提交表单
                    let event = e || window.event;
                    if (!event.shiftKey && event.keyCode == 13) {
                        event.cancelBubble = true;
                        event.preventDefault();
                        event.stopPropagation();
                        this.commitAdds(bindex, findex, cindex);
                    }
                };
            });
        },
        // 提交添加教室
        commitAdd(bindex, findex, cindex) {
            if (!this.addRoomValue) {
                this.$message('教室名称不得为空', 'error');
                return;
            }
            if (!this.addRoomValue && this.currentInputEle == document.activeElement) {
                this.$message('教室名称不得为空', 'error');
                return;
            }

            if (this.addRoomValue && this.addRoomValue.length < 11) {
                this.buildingList[bindex].floorList[findex].floorItem[cindex].name = this.addRoomValue;
                this.addRoomValue = '';

                let paramsData = {
                    teachingBuildingId: this.buildingList[bindex].id, // 楼id
                    floorNumber: this.buildingList[bindex].floorList[findex].floorNumber, // 该房间楼层数
                    classroomNumber: this.buildingList[bindex].floorList[findex].floorItem[cindex].classroomNumber, // 该房间数
                    name: this.buildingList[bindex].floorList[findex].floorItem[cindex].name, // 该房间
                };
                let url = '/sys/classroom/save';
                if (this.isEdit) {
                    url = '/sys/classroom/update';
                    paramsData.id = this.buildingList[bindex].floorList[findex].floorItem[cindex].id;
                }
                this.$axios.post(url, paramsData).then((res) => {
                    if (res.code == 200) {
                        this.isEdit = false;
                        this.isInput = false;
                        this.isDrag = true; // 允许拖拽
                        this.$message(paramsData.id ? '修改成功' : '保存成功', 'success');
                        this.getBuildingList();
                    } else {
                        if (paramsData.id) {
                            this.getBuildingList();
                        } else {
                            this.buildingList[bindex].floorList[findex].floorItem[cindex].name = '';
                        }
                        this.isDrag = false;
                    }
                });
            } else if (this.addRoomValue && this.addRoomValue.length > 10) {
                this.$message('教室名称不得超过10个字符', 'error');
                this.isDrag = false; // 允许拖拽
            }
        },
        // 提交添加教室
        commitAdds(bindex, findex, cindex) {
            if (!this.addRoomValues) {
                this.$message('教室名称不得为空', 'error');
                return;
            }
            if (!this.addRoomValues && this.currentInputEle == document.activeElement) {
                this.$message('教室名称不得为空', 'error');
                return;
            }

            if (this.addRoomValues && this.addRoomValues.length < 11) {
                this.buildingList[bindex].floorList[findex].floorItem[cindex].name = this.addRoomValues;
                this.addRoomValues = '';

                let paramsData = {
                    teachingBuildingId: this.buildingList[bindex].id, // 楼id
                    floorNumber: this.buildingList[bindex].floorList[findex].floorNumber, // 该房间楼层数
                    classroomNumber: this.buildingList[bindex].floorList[findex].floorItem[cindex].classroomNumber, // 该房间数
                    name: this.buildingList[bindex].floorList[findex].floorItem[cindex].name, // 该房间
                };
                let url = '/sys/classroom/save';
                if (this.isEdit) {
                    url = '/sys/classroom/update';
                    paramsData.id = this.buildingList[bindex].floorList[findex].floorItem[cindex].id;
                }
                this.$axios.post(url, paramsData).then((res) => {
                    if (res.code == 200) {
                        this.$message(this.isEdit ? '修改成功' : '添加成功', 'success');
                        this.isEdit = false;
                        this.isInput = false;
                        this.isDrag = true; // 允许拖拽
                        this.getBuildingList();
                    } else {
                        this.buildingList[bindex].floorList[findex].floorItem[cindex].name = '';
                        this.isDrag = false; // 允许拖拽
                    }
                });
            } else if (this.addRoomValues && this.addRoomValues.length > 10) {
                this.$message('教室名称不得超过10个字符', 'error');
                // this.addRoomValues = '';
                this.isDrag = false; // 允许拖拽
            }
        },
        // 输入框失去焦点时
        onblur(bindex, findex, cindex) {
            console.log('this.addRoomValues: ', this.addRoomValues);
            if (this.addRoomValue) {
                this.commitAdd(bindex, findex, cindex);
                // this.addRoomValue = '';
            } else {
                this.isInput = false;
                // this.isDrag = true; // 允许拖拽
                this.isEdit = false;
            }
        },
        onblurs(bindex, findex, cindex) {
            console.log('this.addRoomValues: ', this.addRoomValues);
            if (this.addRoomValues) {
                this.commitAdds(bindex, findex, cindex);
                // this.addRoomValues = '';
            } else {
                this.isInput = false;
                // this.isDrag = true; // 允许拖拽
                this.isEdit = false;
            }
        },
        // 折叠教学楼
        handleChange(val) {
            this.isInput = false;
            this.isDrag = true; // 允许拖拽
        },

        // 编辑
        editName(bindex, findex, cindex, name) {
            this.currentInput = `${bindex}${findex}${cindex}`;
            this.isEdit = true;
            this.isDrag = false;
            this.addRoomValue = name;
            this.$nextTick(() => {
                this.currentInputEle = document.querySelector('.el-input__inner');
                this.currentInputEle.focus();
                this.currentInputEle.onkeydown = (e) => {
                    // 回车提交表单
                    let event = e || window.event;
                    if (!event.shiftKey && event.keyCode == 13) {
                        event.cancelBubble = true;
                        event.preventDefault();
                        event.stopPropagation();
                        event.currentTarget.blur();
                    }
                };
            });
        },

        //删除
        deleteClass(bindex, findex, cindex, classItem) {
            if (classItem) {
                this.deleteShow = true;
                this.deleteRow = classItem;
            } else {
                this.$axios.post('/sys/classroom/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message(res.message, 'success');
                        this.getBuildingList();
                    }
                });
            }
        },

        // 拖拽教室
        dragstart(bindex, findex, cindex) {
            var that = this;
            // console.log("拖放开始",bindex,findex,cindex,that.buildingList[bindex].floorList[findex].floorItem[cindex]);

            that.moveBindex = bindex; // 将要移动bulding的索引 （楼）
            that.moveFindex = findex; // 将要移动floorList的索引 （层）
            that.moveCindex = cindex; // 将要移动floorItem的索引  （间）
        },
        dragover(event) {
            //必须添加dragover事件，不然drop事件也无效
            event.preventDefault();
        },
        dragend(event) {
            // console.log("拖放结束",event.currentTarget);
        },
        drop(bindex, findex, cindex, event) {
            var that = this;
            //阻止默认行为
            event.preventDefault();
            //阻止默认行为
            event.stopPropagation();
            // console.log("拖放到目标",bindex,findex,cindex,that.buildingList[bindex].floorList[findex].floorItem[cindex]);
            that.targetB = bindex; // 目标bulding的索引
            that.targetF = findex; // 目标floorList的索引
            that.targetC = cindex; // 目标floorItem的索引
            //先保存拖动元素index
            var tempn = Object.assign(
                {},
                that.buildingList[that.moveBindex].floorList[that.moveFindex].floorItem[that.moveCindex]
            );

            var temtarget = Object.assign(
                {},
                that.buildingList[that.targetB].floorList[that.targetF].floorItem[that.targetC]
            );

            //将拖动元素位置 换成 目标元素
            Object.assign(
                that.buildingList[that.moveBindex].floorList[that.moveFindex].floorItem[that.moveCindex],
                temtarget
            );

            //将目标元素位置 换成 拖动元素
            Object.assign(that.buildingList[that.targetB].floorList[that.targetF].floorItem[that.targetC], tempn);
            // console.log(that.buildingList);

            let paramsTarget = {
                teachingBuildingId: tempn.teachingBuildingId, // 楼id
                floorNumber: tempn.floorNumber, // 该房间楼层数
                classroomNumber: tempn.classroomNumber, // 该房间数
                name: temtarget.name, // 该房间 名字不用换
                id: temtarget.id,
            };
            let paramsOrigin = {
                teachingBuildingId: temtarget.teachingBuildingId, // 楼id
                floorNumber: temtarget.floorNumber, // 该房间楼层数
                classroomNumber: temtarget.classroomNumber, // 该房间数
                name: tempn.name, // 该房间 名字不用换
                id: tempn.id,
            };
            // 判断 是否是空白格交换教室情况
            if (tempn.id != undefined && temtarget.id != undefined) {
                this.$axios.post('/sys/classroom/update', paramsTarget).then((res) => {
                    if (res.code == 200) {
                        this.$axios.post('/sys/classroom/update', paramsOrigin).then((res) => {
                            if (res.code == 200) {
                                this.$message(res.data, 'success');
                                this.getBuildingList();
                            }
                        });
                    }
                });
            } else if (tempn.id != undefined && temtarget.id == undefined) {
                this.$axios.post('/sys/classroom/update', paramsOrigin).then((res) => {
                    if (res.code == 200) {
                        this.$message(res.data, 'success');
                        this.getBuildingList();
                    }
                });
            } else if (tempn.id == undefined && temtarget.id != undefined) {
                this.$axios.post('/sys/classroom/update', paramsTarget).then((res) => {
                    if (res.code == 200) {
                        this.$message(res.data, 'success');
                        this.getBuildingList();
                    }
                });
            } else if (tempn.id == undefined && temtarget.id == undefined) {
                return false;
            }
        },
        allowDrop: function (event) {
            event.preventDefault();
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-main-wrap {
    .null-data {
        width: 100%;
        height: 100%;
        position: relative;
        .null-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            img {
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

#classroomMangement {
    height: 100%;
    overflow: auto;
    .main-wrap {
        height: 100%;
        padding: 0;
        background: #f1f2f4;
    }
    .building {
        border-top: 1px #f1f2f4 solid;
        border-bottom: 1px #f1f2f4 solid;
        overflow: hidden;
        overflow-x: auto;

        .floor {
            white-space: nowrap;

            .floor_num {
                display: inline-block;
                // float: left;
                width: 60px;
                height: 140px;
                line-height: 140px;
                text-align: center;
                color: #5b8cff;
                font-size: 16px;
                font-weight: bold;
                vertical-align: -webkit-baseline-middle;
            }

            .floor_item {
                display: inline-block;
                white-space: nowrap;
                // width: 1000px;

                .floor_item_li {
                    display: inline-block;
                    width: 212px;
                    height: 142px;
                    border: 1px solid #f1f2f4;
                    padding: 30px 0;
                    box-sizing: border-box;
                    vertical-align: -webkit-baseline-middle;

                    .inputNameEdit {
                        margin-top: 20px;
                    }
                    h3 {
                        position: relative;
                        text-align: center;
                        color: #303133;
                        font-size: 22px;
                        font-weight: bold;
                        margin: 0;

                        .edit {
                            cursor: pointer;

                            font-size: 14px;
                            position: absolute;
                            top: -17px;
                            right: 20px;

                            i {
                                color: #606266;
                            }
                            i:last-child {
                                margin-left: 10px;
                                color: rgb(241, 63, 63);
                            }
                        }
                    }
                    .small {
                        padding-top: 4px;
                        font-size: 18px;
                        width: 100%;
                    }
                    p {
                        text-align: center;
                        margin-top: 20px;
                        color: #303133;
                    }

                    .li_add {
                        text-align: center;
                        line-height: 80px;
                        color: #379bff;
                        cursor: pointer;
                    }
                }
                .big {
                    width: 480%;
                }
                .bigmid {
                    width: 200%;
                }
                .mid {
                    width: 160%;
                }
                .midsmall {
                    width: 120%;
                }
                .small {
                    width: 90%;
                }
                .smallmin {
                    width: 70%;
                }

                .isnull {
                    background: #f4f9ff;
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
#classroomMangement .el-collapse-item__header {
    height: 95px;
    line-height: 95px;
    padding-left: 17px;
    font-size: 20px;
}
#classroomMangement .el-collapse-item {
    margin-bottom: 23px;
}
#classroomMangement .el-collapse-item__content {
    padding: 0;
}
</style>

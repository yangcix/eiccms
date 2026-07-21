<template>
    <div class="second-wrap">
        <p class="content-title"><el-page-header @back="goBack" content="权限授权"></el-page-header></p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="box">
                    <div class="item-wrap">
                        <p>角色名称 <em style="margin-top: 5px">*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.name" disabled></el-input>
                    </div>
                    <div class="item-wrap">
                        <p>数据权限 <em style="margin-top: 5px">*</em>：</p>
                        <el-radio-group v-model="addEditInfo.dataRole">
                            <el-radio :label="4">个人数据</el-radio>
                            <el-radio :label="3">下级数据（含学生数据）</el-radio>
                            <el-radio :label="2">全校数据</el-radio>
                            <el-radio :label="1">全部数据</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="item-wraps">
                        <p>功能权限 <em style="margin-top: 5px">*</em>：</p>
                        <div style="margin-top: 10px">
                            <el-checkbox
                                v-model="authListChecked3"
                                @change="setAuthList3"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >智能研修</el-checkbox
                            >
                            <el-table :data="authList3" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 3)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" width="160" label="二级菜单">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 3)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.children" :key="index">
                                            <el-checkbox
                                                v-for="(items, indexs) in item.children"
                                                :key="indexs"
                                                v-model="items.checked"
                                                @change="setAuthList3Three(items)"
                                                >{{ items.name }}</el-checkbox
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <el-checkbox
                                v-model="authListChecked1"
                                @change="setAuthList1"
                                style="font-size: 16px; font-weight: 600"
                                >智慧教育</el-checkbox
                            >
                            <el-table :data="authList1" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 1)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" width="160" label="二级菜单">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 1)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.children" :key="index">
                                            <el-checkbox
                                                v-for="(items, indexs) in item.children"
                                                :key="indexs"
                                                v-model="items.checked"
                                                @change="setAuthList1Three(items)"
                                                >{{ items.name }}</el-checkbox
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table> -->
                            <el-checkbox
                                v-model="authListChecked2"
                                @change="setAuthList2"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >微集控录播</el-checkbox
                            >
                            <el-table :data="authList2" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 2)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" width="160" label="二级菜单">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 2)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.children" :key="index">
                                            <el-checkbox
                                                v-for="(items, indexs) in item.children"
                                                :key="indexs"
                                                v-model="items.checked"
                                                @change="setAuthList2Three(items)"
                                                >{{ items.name }}</el-checkbox
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table> 
                            <el-checkbox
                                v-model="authListChecked6"
                                @change="setAuthList6"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >项目管理</el-checkbox
                            >
                            <el-table :data="authList6" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 6)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" width="160" label="二级菜单">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 6)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.children" :key="index">
                                            <el-checkbox
                                                v-for="(items, indexs) in item.children"
                                                :key="indexs"
                                                v-model="items.checked"
                                                @change="setAuthList6Three(items)"
                                                >{{ items.name }}</el-checkbox
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-checkbox
                                v-model="authListChecked7"
                                @change="setAuthList7"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >系统管理</el-checkbox
                            >
                            <el-table :data="authList7" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 7)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" width="160" label="二级菜单">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 7)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.children" :key="index">
                                            <el-checkbox
                                                v-for="(items, indexs) in item.children"
                                                :key="indexs"
                                                v-model="items.checked"
                                                @change="setAuthList7Three(items)"
                                                >{{ items.name }}</el-checkbox
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <el-checkbox
                                v-model="authListChecked4"
                                @change="setAuthList4"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >个人中心</el-checkbox
                            >
                            <el-table :data="authList4" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 4)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" align="left" label="页面与按钮权限">
                                    <template v-if="scope.row.children" slot-scope="scope">
                                        <el-checkbox
                                            v-for="(item, index) in scope.row.children"
                                            :key="index"
                                            v-model="item.checked"
                                            @change="setAuthList1Two(item, 4)"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                            </el-table> -->

                            <el-checkbox
                                v-model="authListChecked5"
                                @change="setAuthList5"
                                style="margin-top: 10px; font-size: 16px; font-weight: 600"
                                >大数据看板</el-checkbox
                            >
                            <el-table :data="authList5" border style="min-width: 1320px; margin-top: 10px">
                                <el-table-column prop="name" align="left" width="120" label="一级菜单">
                                    <template slot-scope="scope">
                                        <el-checkbox
                                            v-model="scope.row.checked"
                                            @change="setAuthList1One(scope.row, 5)"
                                            >{{ scope.row.name }}</el-checkbox
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <el-button type="primary" class="edit-btn" @click="httpRequest">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            version: localStorage.getItem('version'),
            addEditInfo: {
                name: this.$route.query.name,
                dataRole: '',
                chooseRole: '',
            },
            authList: [],
            checkList: [],
            authList1: [],
            authListChecked1: this.$route.query.id == 6 ? true : false,
            authList2: [],
            authListChecked2: this.$route.query.id == 6 ? true : false,
            authList3: [],
            authListChecked3: this.$route.query.id == 6 ? true : false,
            authList4: [],
            authListChecked4: this.$route.query.id == 6 ? true : false,
            authList5: [],
            authListChecked5: this.$route.query.id == 6 ? true : false,
            authList6: [],
            authListChecked6: this.$route.query.id == 6 ? true : false,
            authList7: [],
            authListChecked7: this.$route.query.id == 6 ? true : false,
        };
    },
    components: {},
    mounted() {
        this.handleTheme();
    },
    methods: {
        setAuthList1(val) {
            if (val == true) {
                this.authList1.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = true;
                                });
                            }
                        });
                    }
                });
            } else {
                this.authList1.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = false;
                                });
                            }
                        });
                    }
                });
            }
        },
        setAuthList1One(val, type) {
            if (val.checked == true) {
                if (type == 1) {
                    this.authListChecked1 = true;
                } else if (type == 2) {
                    this.authListChecked2 = true;
                } else if (type == 3) {
                    this.authListChecked3 = true;
                } else if (type == 4) {
                    this.authListChecked4 = true;
                } else if (type == 5) {
                    this.authListChecked5 = true;
                } else if (type == 6) {
                    this.authListChecked6 = true;
                } else if (type == 7) {
                    this.authListChecked7 = true;
                }
                if (val.children) {
                    val.children.forEach((el) => {
                        el.checked = true;
                        if (el.children) {
                            el.children.forEach((ele) => {
                                ele.checked = true;
                            });
                        }
                    });
                }
            } else {
                if (val.children) {
                    val.children.forEach((el) => {
                        el.checked = false;
                        if (el.children) {
                            el.children.forEach((ele) => {
                                ele.checked = false;
                            });
                        }
                    });
                }
            }
        },
        setAuthList1Two(val, type) {
            if (val.checked == true) {
                if (val.children) {
                    val.children.forEach((el) => {
                        if (el.parentId == val.id) {
                            el.checked = true;
                        }
                    });
                }
                if (type == 1) {
                    this.authListChecked1 = true;
                    this.authList1.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 2) {
                    this.authListChecked2 = true;
                    this.authList2.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 3) {
                    this.authListChecked3 = true;
                    this.authList3.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 4) {
                    this.authListChecked4 = true;
                    this.authList4.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 5) {
                    this.authListChecked5 = true;
                    this.authList5.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 6) {
                    this.authListChecked6 = true;
                    this.authList6.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                } else if (type == 7) {
                    this.authListChecked7 = true;
                    this.authList7.forEach((el) => {
                        if (val.parentId == el.id) {
                            el.checked = true;
                        }
                    });
                }
            } else {
                if (val.children) {
                    val.children.forEach((el) => {
                        if (el.parentId == val.id) {
                            el.checked = false;
                        }
                    });
                }
            }
        },
        setAuthList1Three(val) {
            if (val.checked == true) {
                this.authListChecked1 = true;
                this.authList1.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.id == val.parentId) {
                                ele.checked = true;
                                if (ele.parentId == el.id) {
                                    el.checked = true;
                                }
                            }
                        });
                    }
                });
            }
        },
        setAuthList2Three(val) {
            if (val.checked == true) {
                this.authListChecked2 = true;
                this.authList2.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.id == val.parentId) {
                                ele.checked = true;
                                if (ele.parentId == el.id) {
                                    el.checked = true;
                                }
                            }
                        });
                    }
                });
            }
        },
        setAuthList3Three(val) {
            if (val.checked == true) {
                this.authListChecked3 = true;
                this.authList3.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.id == val.parentId) {
                                ele.checked = true;
                                if (ele.parentId == el.id) {
                                    el.checked = true;
                                }
                            }
                        });
                    }
                });
            }
        },
        setAuthList6Three(val) {
            if (val.checked == true) {
                this.authListChecked6 = true;
                this.authList6.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.id == val.parentId) {
                                ele.checked = true;
                                if (ele.parentId == el.id) {
                                    el.checked = true;
                                }
                            }
                        });
                    }
                });
            }
        },
        setAuthList7Three(val) {
            if (val.checked == true) {
                this.authListChecked7 = true;
                this.authList7.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.id == val.parentId) {
                                ele.checked = true;
                                if (ele.parentId == el.id) {
                                    el.checked = true;
                                }
                            }
                        });
                    }
                });
            }
        },
        setAuthList2(val) {
            if (val == true) {
                this.authList2.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = true;
                                });
                            }
                        });
                    }
                });
            } else {
                this.authList2.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = false;
                                });
                            }
                        });
                    }
                });
            }
        },
        setAuthList3(val) {
            if (val == true) {
                this.authList3.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = true;
                                });
                            }
                        });
                    }
                });
            } else {
                this.authList3.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = false;
                                });
                            }
                        });
                    }
                });
            }
        },
        setAuthList4(val) {
            if (val == true) {
                this.authList4.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                        });
                    }
                });
            } else {
                this.authList4.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                        });
                    }
                });
            }
        },
        setAuthList5(val) {
            if (val == true) {
                this.authList5.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                        });
                    }
                });
            } else {
                this.authList5.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                        });
                    }
                });
            }
        },
        setAuthList6(val) {
            if (val == true) {
                this.authList6.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = true;
                                });
                            }
                        });
                    }
                });
            } else {
                this.authList6.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = false;
                                });
                            }
                        });
                    }
                });
            }
        },
        setAuthList7(val) {
            if (val == true) {
                this.authList7.forEach((el) => {
                    el.checked = true;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = true;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = true;
                                });
                            }
                        });
                    }
                });
            } else {
                this.authList7.forEach((el) => {
                    el.checked = false;
                    if (el.children) {
                        el.children.forEach((ele) => {
                            ele.checked = false;
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    eles.checked = false;
                                });
                            }
                        });
                    }
                });
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        httpRequest() {
            let data = [];
            this.authList1.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                        if (ele.children) {
                            ele.children.forEach((eles) => {
                                if (eles.checked == true) {
                                    data.push(eles.id);
                                }
                            });
                        }
                    });
                }
            });
            this.authList2.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                        if (ele.children) {
                            ele.children.forEach((eles) => {
                                if (eles.checked == true) {
                                    data.push(eles.id);
                                }
                            });
                        }
                    });
                }
            });
            this.authList3.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                        if (ele.children) {
                            ele.children.forEach((eles) => {
                                if (eles.checked == true) {
                                    data.push(eles.id);
                                }
                            });
                        }
                    });
                }
            });
            this.authList4.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                    });
                }
            });
            this.authList5.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                    });
                }
            });
            this.authList6.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                        if (ele.children) {
                            ele.children.forEach((eles) => {
                                if (eles.checked == true) {
                                    data.push(eles.id);
                                }
                            });
                        }
                    });
                }
            });
            this.authList7.forEach((el) => {
                if (el.checked == true) {
                    data.push(el.id);
                }
                if (el.children) {
                    el.children.forEach((ele) => {
                        if (ele.checked == true) {
                            data.push(ele.id);
                        }
                        if (ele.children) {
                            ele.children.forEach((eles) => {
                                if (eles.checked == true) {
                                    data.push(eles.id);
                                }
                            });
                        }
                    });
                }
            });
            this.$axios
                .post('/sys/role/updateRoleOptAuth', {
                    menuIds: data,
                    roleId: this.$route.query.id,
                    dataRole: this.addEditInfo.dataRole,
                    chooseRole: this.addEditInfo.chooseRole,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.$message(res.message, 'success');
                        this.handleTheme();
                    }
                });
        },
        handleTheme() {
            this.authList1 = [];
            this.authList2 = [];
            this.authList3 = [];
            this.authList4 = [];
            this.authList5 = [];
            this.authList6 = [];
            this.authList7 = [];
            this.$axios.get('/sys/role/getMenuInfo', {roleId: this.$route.query.id}).then((res) => {
                let arr = [];
                console.log('this.$route.query.id: ', this.$route.query.id);
                // 修改后代码
                if (this.$route.query.id == 6) {
                    console.log('走第一个');
                    const excludeIds = [10205, 8335, 9181, 13909, 13910, 13911, 13912, 14020, 14040, 13917];
                    console.log('res.data.menuList 11111111111111111111111111   start: ', res.data.menuList);
                    arr = res.data.menuList.filter((el) => !excludeIds.includes(el.id));
                    console.log('res.data.menuList 11111111111111111111111111   end: ', res.data.menuList);
                } else {
                    console.log('走第二个');
                    const excludeIds = [
                        10205, 8335, 9181, 13201, 13908, 13909, 13910, 13911, 13912, 14020, 14040, 13917,
                    ];
                    console.log('res.data.menuList 11111111111111111111111111   start: ', res.data.menuList);
                    arr = res.data.menuList.filter((el) => !excludeIds.includes(el.id));
                    console.log('res.data.menuList 11111111111111111111111111   end: ', res.data.menuList);
                }

                arr.forEach((el) => {
                    let isTrue = res.data.choice.includes(el.id);
                    if (isTrue == true) {
                        el.checked = true;
                    } else {
                        el.checked = false;
                    }
                });
                this.authList = creatTree(arr);
                this.authList.forEach((el) => {
                    if (el.type == -7) {
                        this.authList1.push(el);
                    }
                    if (el.type == -1) {
                        this.authList2.push(el);
                    }
                    if (el.type == -2) {
                        this.authList3.push(el);
                    }
                    if (el.type == -3) {
                        this.authList4.push(el);
                    }
                    if (el.type == -4) {
                        this.authList5.push(el);
                    }
                    if (el.type == -5) {
                        this.authList6.push(el);
                    }
                    if (el.type == -6) {
                        this.authList7.push(el);
                    }
                });
                this.authList1.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    if (eles.checked == true) {
                                        ele.checked = true;
                                        el.checked = true;
                                    }
                                });
                            }
                        });
                    }
                });
                this.authList3.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    if (eles.checked == true) {
                                        ele.checked = true;
                                        el.checked = true;
                                    }
                                });
                            }
                        });
                    }
                });
                this.authList2.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                            if (ele.children) {
                                ele.children.forEach((eles) => {
                                    if (eles.checked == true) {
                                        ele.checked = true;
                                        el.checked = true;
                                    }
                                });
                            }
                        });
                    }
                });
                this.authList4.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                        });
                    }
                });
                this.authList5.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                        });
                    }
                });
                this.authList6.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                        });
                    }
                });
                this.authList7.forEach((el) => {
                    if (el.children) {
                        el.children.forEach((ele) => {
                            if (ele.checked == true) {
                                el.checked = true;
                            }
                        });
                    }
                });
                for (let i = 0; i < this.authList1.length; i++) {
                    if (this.authList1[i].checked == true) {
                        this.authListChecked1 = true;
                    }
                }
                for (let i = 0; i < this.authList2.length; i++) {
                    if (this.authList2[i].checked == true) {
                        this.authListChecked2 = true;
                    }
                }
                for (let i = 0; i < this.authList3.length; i++) {
                    if (this.authList3[i].checked == true) {
                        this.authListChecked3 = true;
                    }
                }
                for (let i = 0; i < this.authList4.length; i++) {
                    if (this.authList4[i].checked == true) {
                        this.authListChecked4 = true;
                    }
                }
                for (let i = 0; i < this.authList5.length; i++) {
                    if (this.authList5[i].checked == true) {
                        this.authListChecked5 = true;
                    }
                }
                for (let i = 0; i < this.authList6.length; i++) {
                    if (this.authList6[i].checked == true) {
                        this.authListChecked6 = true;
                    }
                }
                for (let i = 0; i < this.authList7.length; i++) {
                    if (this.authList7[i].checked == true) {
                        this.authListChecked7 = true;
                    }
                }
                this.addEditInfo.chooseRole = res.data.chooseRole;
                this.addEditInfo.dataRole = res.data.dataRole;
                this.checkList = res.data.choice;
            });
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep .el-upload-dragger {
    width: 280px;
    height: 130px;
}
::v-deep .el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}

::v-deep .el-upload-list__item-status-label {
    display: block;
}
.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 10px 10px 54px 60px;
}
.notice-wrap {
    display: inline-block;
    padding: 23px 80px 24px 80px;
    font-size: 14px;
    color: #303133;
    background: #eff3f9;

    p {
        line-height: 24px;
    }
}
.item-scroll {
    overflow: hidden;
    height: 100%;
    width: 100%;
    .box {
        overflow-y: scroll;
        width: 100%;
        height: 100%;
    }
}
.item-wraps {
    display: flex;
    margin-top: 25px;
    p:first-child {
        // display: inline-block;
        min-width: 114px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }
    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
    p {
        text-align: center;
        font-size: 14px;
        color: #606266;
    }
    em {
        color: #f64646;
    }
}
.item-wrap {
    display: flex;
    align-items: center;
    margin-top: 25px;
    em {
        color: #f64646;
    }
    p:first-child {
        width: 114px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }
    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
    .class-type {
        cursor: pointer;

        .act {
            border: solid 3px #5b8cff;
            border-radius: 8px;
        }

        img {
            width: 286px;
            height: 159px;
            border: solid 3px #fff;
        }
        p {
            margin-top: 7px;
            text-align: center;
            font-size: 14px;
            color: #606266;
        }
    }
}
.edufile {
    align-items: flex-start;
    p {
        height: 40px;
        line-height: 40px;
    }
}
.upload-wrap {
    height: 130px;
    width: 280px;
    textarea {
        height: 130px;
        width: 280px;
        border: solid #dcdfe6 1px;
        resize: none;
    }
}
.upload-box {
    align-items: start;
    .p1 {
        margin-right: 5px;
        line-height: 40px;
    }
    ::v-deep .el-upload-list {
        margin: -146px 0 0 25px;
        width: 222px;
    }
}
.edit-btn {
    width: 160px;
    height: 40px;
    margin: 35px 0 60px 130px;
}
.err-notice {
    margin-left: 20px;
    color: #b3b6ba;
    font-size: 12px;
    &.err-color {
        color: #f64646;
    }
}

.itemType {
    float: left;
    padding-left: 10px;
    padding-bottom: 10px;

    .p {
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
        float: left;
    }

    .el-select {
        float: left !important;
    }
}

.tip {
    text-align: center;
}
.upload-demo .el-upload-list {
    margin: -145px 0 0 15px;
    width: 250px;
}
.edufile .el-upload-list {
    margin: 0 !important;
}
.edufile .el-upload-list__item-name {
    padding: 0 !important;
    overflow: hidden;
    width: 240px;
    text-overflow: ellipsis;
}
.edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}
.upload-demo .el-upload-list__item-status-label {
    display: block;
}
::v-deep .el-table .el-table__cell {
    vertical-align: top;
}
</style>

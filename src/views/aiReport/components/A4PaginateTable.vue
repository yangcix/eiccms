<template>
    <div class="app-container">
        <div class="print-wrapper" id="printArea">
            <div v-for="(page, index) in pages" :key="index" class="page-a4">
                <!-- 标题 -->
                <div class="table-title" v-show="index == 0">
                    <p>综合评分：{{ reportData.totalScore }}</p>
                </div>

                <!-- 原生表格 -->
                <table>
                    <thead>
                        <tr>
                            <th colspan="2" style="width:15%;text-align:center;">评价项目</th>
                            <th style="width:auto;text-align:center;">评价要素</th>
                            <th style="width:50px;text-align:center;">分值</th>
                            <th style="width:50px;text-align:center;">评分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in page.rows" :key="row.score">
                            <template v-if="hasLevelThree(row)">
                                <td
                                    v-if="row.showLevelOne"
                                    :rowspan="row.levelOneSpan"
                                    style="text-align:center;vertical-align:middle;font-weight:bold;border-right:1px solid #333;"
                                >
                                    <div style="padding:4px 6px;">{{ row.levelone }}</div>
                                </td>
                                <td style="text-align:center;vertical-align:middle;border-right:1px solid #333;">
                                    <div style="padding:4px 6px;">{{ row.levelTwo }}</div>
                                </td>
                            </template>
                            <template v-else>
                                <td
                                    v-if="row.showLevelOne"
                                    :rowspan="row.levelOneSpan"
                                    colspan="2"
                                    style="text-align:center;vertical-align:middle;"
                                >
                                    <span v-html="row.levelOneHtml"></span>
                                </td>
                            </template>

                            <td>
                                <span v-if="hasLevelThree(row)" v-html="row.levelThreeHtml"></span>
                                <span v-else v-html="row.levelTwoHtml"></span>
                            </td>
                            <td class="center">{{ row.score }}</td>
                            <td class="center">{{ row.rating }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="page-footer">— 第 {{ index + 1 }} 页 / 共 {{ pages.length }} 页 —</div>
            </div>
        </div>

        <div ref="measurer" class="measurer-container" />
    </div>
</template>

<script>

export default {
    name: 'A4PaginateTable',
    props: {
        reportData: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            tableData: [],
            pages: [],
            pageConfig: {
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 10,
                paddingRight: 10,
                footerHeight: 40,
                pageHeight: 297,
            },
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        hasLevelThree(row) {
            return row.levelThree && row.levelThree.trim() !== '';
        },

        escapeHtml(text) {
            if (!text) return '';
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, (m) => map[m]);
        },

        nl2br(text) {
            if (!text) return '';
            return this.escapeHtml(text).replace(/\n/g, '<br>');
        },

        computeRowspan(data) {
            if (!data || data.length === 0) return data;
            let i = 0;
            while (i < data.length) {
                let j = i + 1;
                while (j < data.length && data[j].levelone === data[i].levelone) j++;
                const span = j - i;
                for (let k = i; k < j; k++) {
                    data[k].showLevelOne = k === i;
                    data[k].levelOneSpan = span;
                }
                i = j;
            }
            return data;
        },

        initData() {
            // 优先使用 props 传入的数据，否则使用示例数据
            const sourceData = this.reportData?.scoreTableEvaluationProjectList ;
            this.tableData = JSON.parse(JSON.stringify(sourceData));

            this.tableData.forEach((row) => {
                row.levelOneHtml = this.nl2br(row.levelone);
                row.levelTwoHtml = this.nl2br(row.levelTwo);
                row.levelThreeHtml = this.nl2br(row.levelThree);
            });

            this.tableData = this.computeRowspan(this.tableData);
            this.doPaginate();
        },

        doPaginate() {
            const data = this.tableData;
            if (!data || data.length === 0) {
                this.pages = [];
                return;
            }

            const config = this.pageConfig;
            const container = this.$refs.measurer;
            container.innerHTML = '';

            // ---- 测量表格 ----
            const table = document.createElement('table');
            table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px;';
            table.innerHTML = `
                <colgroup>
                    <col style="width:7.5%"><col style="width:7.5%">
                    <col style="width:auto"><col style="width:50px"><col style="width:50px">
                </colgroup>
                <thead>
                    <tr>
                        <th colspan="2" style="border:1px solid #ddd;padding:4px 6px;text-align:center;width:15%;">评价项目</th>
                        <th style="border:1px solid #ddd;padding:4px 6px;text-align:center;width:auto;">评价要素</th>
                        <th style="border:1px solid #ddd;padding:4px 6px;text-align:center;width:50px;">分值</th>
                        <th style="border:1px solid #ddd;padding:4px 6px;text-align:center;width:50px;">评分</th>
                    </tr>
                </thead>
                <tbody id="measureTbody"></tbody>
            `;
            container.appendChild(table);

            const tbody = document.getElementById('measureTbody');
            const headerHeight = table.querySelector('thead').offsetHeight || 40;

            const availHeightPx =
                config.pageHeight * 3.7795 -
                (config.paddingTop + config.paddingBottom) * 3.7795 -
                config.footerHeight;

            // ---- 逐行测量 ----
            const rowHeights = [];
            const groupMap = {};

            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                const hasLevelThree = this.hasLevelThree(row);

                if (!groupMap[row.levelone]) groupMap[row.levelone] = [];
                groupMap[row.levelone].push(index);

                let tdHtml = '';
                if (hasLevelThree) {
                    tdHtml += `
                        <td style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:center;vertical-align:middle;font-weight:bold;">${row.levelone}</td>
                        <td style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:center;vertical-align:middle;">${row.levelTwo || ''}</td>
                    `;
                } else {
                    tdHtml += `
                        <td colspan="2" style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:center;vertical-align:middle;">${row.levelone || ''}</td>
                    `;
                }

                const elementContent = hasLevelThree ? row.levelThree || '' : row.levelTwo || '';
                tdHtml += `
                    <td style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:left;vertical-align:middle;">${elementContent.replace(/\n/g, '<br>')}</td>
                    <td style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:center;vertical-align:middle;">${row.score}</td>
                    <td style="border:1px solid #ddd;padding:4px 6px;line-height:1.7;text-align:center;vertical-align:middle;">${row.rating}</td>
                `;

                tr.innerHTML = tdHtml;
                tbody.appendChild(tr);
                rowHeights.push(tr.offsetHeight || 40);
                tbody.innerHTML = '';
            });

            container.innerHTML = '';

            // ---- 按组分页 ----
            const pages = [];
            let currentPage = [];
            let currentHeight = 0;

            Object.keys(groupMap).forEach((groupKey) => {
                const indices = groupMap[groupKey];
                const groupRows = indices.map((idx) => data[idx]);
                const groupTotalHeight = indices.reduce((sum, idx) => sum + rowHeights[idx], 0);

                if (currentPage.length === 0) currentHeight = headerHeight;

                if (currentHeight + groupTotalHeight > availHeightPx && currentPage.length > 0) {
                    pages.push({ rows: [...currentPage] });
                    currentPage = [];
                    currentHeight = headerHeight + groupTotalHeight;
                    currentPage.push(...groupRows);
                } else {
                    currentHeight += groupTotalHeight;
                    currentPage.push(...groupRows);
                }
            });

            if (currentPage.length > 0) pages.push({ rows: [...currentPage] });

            // ---- 重新计算每页 rowspan ----
            pages.forEach((page) => {
                const pageRows = page.rows;
                let i = 0;
                while (i < pageRows.length) {
                    let j = i + 1;
                    while (j < pageRows.length && pageRows[j].levelone === pageRows[i].levelone) j++;
                    const span = j - i;
                    for (let k = i; k < j; k++) {
                        pageRows[k].showLevelOne = k === i;
                        pageRows[k].levelOneSpan = span;
                    }
                    i = j;
                }
            });

            this.pages = pages;
        },
    },
    watch: {
        'reportData.scoreTableEvaluationProjectList': {
            deep: true,
            immediate: true,
            handler() {
                if (this.reportData?.scoreTableEvaluationProjectList) {
                    this.initData();
                }
            },
        },
    },
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.app-container {
    padding: 20px;
    min-height: 100vh;
}

.print-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.page-a4 {
    width: 210mm;
    min-height: 290mm;
    padding: 12mm 10mm 5mm;
    background: white;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.page-a4 table {
    flex: 1;
}

.page-footer {
    margin-top: auto;
    text-align: center;
    font-size: 11px;
    color: #999;
    padding-top: 10px;
    border-top: 1px dashed #ddd;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: fixed;
}

table th,
table td {
    border: 1px solid #333;
    padding: 4px 6px;
    word-break: break-word;
    line-height: 1.7;
    text-align: left;
    vertical-align: middle;
}

table th {
    background: #f0f2f5;
    font-weight: 700;
    text-align: center;
}

table td.center {
    text-align: center;
}

.measurer-container {
    position: absolute;
    left: -9999px;
    top: 0;
    width: 210mm;
    padding: 12mm 10mm;
    box-sizing: border-box;
    background: white;
    visibility: hidden;
    pointer-events: none;
    z-index: -1;
}

.measurer-container table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
}

.measurer-container table th,
.measurer-container table td {
    border: 1px solid #ddd;
    padding: 4px 6px;
    word-break: break-word;
    line-height: 1.7;
}

.table-title {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 8px;
}

@media print {
    .app-container {
        background: white;
        padding: 20px;
    }
    .page-a4 {
        box-shadow: none !important;
        page-break-after: always;
        margin: 0;
        padding: 20mm 10mm 5mm;
        min-height: 297mm;
    }
    .page-a4:last-child {
        page-break-after: auto;
    }
}
</style>
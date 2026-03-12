import * as XLSX from 'xlsx';

/**
 * 通用Excel导出工具
 * @param {Array} data - 要导出的数据数组
 * @param {Object} headerConfig - 表头配置对象 { 显示名称: 字段key }
 * @param {String} fileName - 导出的文件名（可选，默认'导出数据.xlsx'）
 * @param {String} sheetName - 工作表名称（可选，默认'Sheet1'）
 * @returns {Promise} - 返回Promise，方便调用后执行其他操作
 */
export const exportToExcel = (data, headerConfig, fileName = '导出数据.xlsx', sheetName = 'Sheet1') => {
    return new Promise((resolve, reject) => {
        try {
            if (!data || !data.length) {
                console.warn('没有数据可导出');
                resolve(false);
                return;
            }

            // 1. 根据headerConfig格式化数据
            const formattedData = data.map((item) => {
                const formattedItem = {};
                Object.keys(headerConfig).forEach((headerName) => {
                    const fieldKey = headerConfig[headerName];
                    formattedItem[headerName] = item[fieldKey] || ''; // 如果字段不存在，填充空字符串
                });
                return formattedItem;
            });

            // 2. 创建工作簿和工作表
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();

            // 3. 自动调整列宽（可选，提升用户体验）
            const colWidths = [];
            Object.keys(headerConfig).forEach((headerName) => {
                // 根据表头内容和数据内容计算列宽
                let maxLength = headerName.length;
                data.forEach((item) => {
                    const fieldKey = headerConfig[headerName];
                    const value = item[fieldKey] ? String(item[fieldKey]) : '';
                    maxLength = Math.max(maxLength, value.length);
                });
                // 限制最大宽度，设置最小宽度
                colWidths.push({ wch: Math.min(Math.max(maxLength, 10), 50) });
            });
            worksheet['!cols'] = colWidths;

            // 4. 将工作表放入工作簿
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // 5. 触发下载
            XLSX.writeFile(workbook, fileName);

            resolve(true);
        } catch (error) {
            console.error('导出Excel失败:', error);
            reject(error);
        }
    });
};
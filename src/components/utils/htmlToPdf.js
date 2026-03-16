import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import axios from "axios";

/**
 * 生成 PDF 需指定属性 data-order="1" 2，3，4，5，6
 * @param eleSelector 选择器
 * @param pdfName 文件名
 * @param uploadUrl 上传地址
 * @param analysisId 分析ID
 * @param analysisType 分析类型
 * @returns
 */
async function downloadPDF(eleSelector, pdfName, uploadUrl, analysisId, analysisType) {
    const elements = document.querySelectorAll(eleSelector);

    // 根据 data-order 排序元素
    const sortedElements = Array.from(elements).sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order'), 10);
        const orderB = parseInt(b.getAttribute('data-order'), 10);
        return orderA - orderB;  // 按照数字顺序排序
    });

    const pdf = new JsPDF('p', 'px', [794, 1123]);  // A4 大小
    let pageCount = 0;

    // 使用 for...of 确保按顺序处理每个页面
    for (const [index, element] of sortedElements.entries()) {
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgWidth = 794;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (index > 0) {
                pdf.addPage();  // 如果不是第一页，则添加新的一页
            }
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            pageCount++;

        } catch (error) {
            console.error(`页面 ${index + 1} 渲染失败:`, error);
        }
    }

    // 生成 PDF 并获取 Blob 对象
    const pdfBlob = pdf.output('blob');

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', pdfBlob, pdfName);
    formData.append('analysisId', analysisId);
    formData.append('analysisType', analysisType);

    // 发送 POST 请求上传文件
    // try {
    //     const response = await axios.post(uploadUrl, formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     });
    //     console.log('文件上传成功:', response.data);
    // } catch (error) {
    //     console.error('文件上传失败:', error);
    // }

    // 生成 PDF
    console.log(`共生成 ${pageCount} 页`);
    pdf.save(pdfName);
}

export default {
    downloadPDF
};


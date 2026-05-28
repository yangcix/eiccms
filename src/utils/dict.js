export const DICT = {
    // 录制状态
    RECORD_STATUS: [
        { label: '待提交', value: -1 },
        { label: '未开始', value: 0 },
        { label: '录制中', value: 1 },
        { label: '录制完成', value: 2 },
        { label: '录制失败', value: 3 },
    ],
    // 分析状态
    ANALYSIS_STATUS: [
        { label: '排队中', value: -1 },
        { label: '分析中', value: 1 },
        { label: '分析成功', value: 2 },
        { label: '分析失败', value: 3 },
    ],
};
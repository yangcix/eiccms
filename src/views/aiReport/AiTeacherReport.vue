<template>
    <div id="ai-teacher-report" class="report-container">
        <!--  第一页，报告信息页  -->
        <div class="page-container" data-order="1">
            <header style="width: 56%; margin: 0 auto">
                <!--        <div>
                  &lt;!&ndash; 下载按钮 &ndash;&gt;
                  <button @click="downloadPDF">下载 PDF</button>
                </div>-->
                <img src="../../assets/imgs/logo-eicc.png" alt="Logo" style="margin-top: 80px" />
                <h1 style="margin: 50px 0 0">AI课堂报告</h1>
                <p style="margin: 8px 0 80px; font-size: 22px; font-weight: 700">（教 师 版）</p>
                <h2 style="width: 100%">《 {{ baseInfo?.analysisName }} 》</h2>
            </header>
            <main style="width: 50%; height: 40%; margin: 150px auto auto auto; font-size: 18px; line-height: 18px">
                <section>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">执 教 教 师：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.teacherName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">
                            班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：
                        </p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.gradeName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">
                            学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：
                        </p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.subjectName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">报 告 时 间：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.reportTimeCreated }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">所 在 学 校：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.schoolName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">报 告 编 号：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.reportNumber }}</p>
                    </div>
                </section>
            </main>
            <footer class="footer-version">
                <p>版本：1.5</p>
            </footer>
        </div>

        <!--  第二页，课堂整体表现  -->
        <div class="page-container" data-order="2">
            <header>
                <h2 style="margin-top: 30px">第一部分 课堂概要</h2>
                <h3 style="margin-top: 30px; margin-bottom: 20px">（一）课堂整体表现</h3>
            </header>
            <section>
                <div id="integralAnalysis" style="width: 100%; height: 400px; margin: 0 auto"></div>
                <div style="margin-top: 20px">
                    <!--          <p id="integralAnalysisText" v-html="integralAnalysis?.summaryText" class="summary-text text-indent-2em"></p>
          <p v-html="periodAnalysis?.summaryText" class="summary-text text-indent-2em"></p>
          <p v-html="teacherTeachAnalysis?.summaryText" class="summary-text text-indent-2em"></p>
          <p v-html="studentAnalysis?.summaryText" class="summary-text text-indent-2em"></p>
          <p v-html="integralAnalysis?.fiasSummaryText" class="summary-text text-indent-2em"></p>
          <p v-html="integralAnalysis?.ireSummaryText" class="summary-text text-indent-2em"></p>
          <p v-html="integralAnalysis?.facilitationSummaryText" class="summary-text text-indent-2em"></p>-->
                    <p class="summary-text text-indent-2em" v-if="integralAnalysis?.summaryText">
                        <template v-for="(segment, index) in integralAnalysis?.summaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="periodAnalysis?.summaryText">
                        <span>在教学效果方面，</span>
                        <template v-for="(segment, index) in periodAnalysis?.summaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="teacherTeachAnalysis?.summaryText">
                        <template v-for="(segment, index) in teacherTeachAnalysis?.summaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="studentAnalysis?.summaryText">
                        <template v-for="(segment, index) in studentAnalysis?.summaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="integralAnalysis?.fiasSummaryText">
                        <template v-for="(segment, index) in integralAnalysis?.fiasSummaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="integralAnalysis?.ireSummaryText">
                        <template v-for="(segment, index) in integralAnalysis?.ireSummaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                    <p class="summary-text text-indent-2em" v-if="integralAnalysis?.facilitationSummaryText">
                        <template v-for="(segment, index) in integralAnalysis?.facilitationSummaryText">
                            <!-- 普通文本 -->
                            <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                            <!-- 高亮文本（带样式） -->
                            <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                        </template>
                    </p>
                </div>
            </section>
            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 1 —</div>
            </footer>
        </div>

        <!--  第三页，教学效果序列分析  -->
        <div class="page-container" data-order="3">
            <header>
                <h3 style="margin-top: 30px">（二）教学效果序列分析</h3>
            </header>

            <!--   periodAnalysis.periods   -->
            <section class="table-section">
                <div style="margin-top: 40px; margin-bottom: 40px">
                    <p class="indented-text line-height">
                        教学效果序列分析，即按照授课主题将课堂40分钟划分为若干活动片段，以时间序列为横轴变量，呈现出教师教学组织、学生学习效果的过程情况。本堂课的教学效果序列图如下。
                    </p>
                </div>
                <div class="right-table" v-if="periodAnalysis.periods.length > 0">
                    <div v-for="(chunk, chunkIndex) in periodAnalysis?.chunkedPeriods" :key="chunkIndex">
                        <table>
                            <tbody>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td sticky-column">授课主题</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-green"
                                        style="width: 200px"
                                    >
                                        {{ period?.clazzThemes?.join(' ') }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td sticky-column">
                                        师生发言相关度<span class="red-text-color">【注1】</span>
                                    </td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-orange"
                                        style="width: 200px"
                                    >
                                        {{ parseFloat(period?.studentSpeechRelevancy ?? 0).toFixed(2) }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td sticky-column">学生发言主题</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-orange"
                                        style="width: 200px"
                                    >
                                        {{ period?.studentThemes?.join(' ') || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">最长单次学生发言</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-orange"
                                        style="width: 200px"
                                    >
                                        {{ parseFloat(period?.studentMaxDuration ?? 0).toFixed(2) }} 秒
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">主要学习风格</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-orange"
                                        style="width: 200px"
                                    >
                                        {{ period?.studentStudyStyle || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">提问模式</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-purple"
                                        style="width: 200px"
                                    >
                                        {{ period?.clazzIdrePatterns?.join(' ') || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">知识传递的主要方式</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-purple"
                                        style="width: 200px"
                                    >
                                        {{ period?.clazzKnowledgeTransferMethod || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">互动的主要模式</td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-purple"
                                        style="width: 200px"
                                    >
                                        {{ period?.clazzInteractiveModel || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td">
                                        学习促成的主要方式<span class="red-text-color">【注2】</span>
                                    </td>
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="right-table-td-purple"
                                        style="width: 200px"
                                    >
                                        {{ period?.teacherFacilitationMethod || '-' }}
                                    </td>
                                </tr>
                                <tr class="right-table-tr">
                                    <td class="right-table-left-td"></td>
                                    <!--              :style="{ marginLeft: index === 0 ? '180px' : '56px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }"-->
                                    <td
                                        v-for="(period, index) in chunk"
                                        :key="index"
                                        class="font-size-10"
                                        style="text-align: left; position: relative; left: -20px"
                                    >
                                        <!--                {{ index === periodAnalysis?.periods.length - 1 ? period?.stopAudioTime : period?.startAudioTime }}-->
                                        {{ period?.startAudioTime }}
                                    </td>
                                    <!-- 增加一个 td 用于显示最后一条数据的 stopAudioTime -->
                                    <td class="font-size-10" style="text-align: left; position: relative; left: -20px">
                                        {{ chunk[chunk.length - 1]?.stopAudioTime }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--          <table>
            <tbody>
            <tr class="right-table-tr">
              <td class="right-table-left-td sticky-column">授课主题</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-green" style="width: 200px;"
              >
                {{ period?.clazzThemes?.join(" ") }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td sticky-column">师生发言相关度<span class="red-text-color">【注1】</span></td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-orange" style="width: 200px;"
              >
                {{ parseFloat(period?.studentSpeechRelevancy ?? 0).toFixed(2) }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td sticky-column">学生发言主题</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-orange" style="width: 200px;"
              >
                {{ period?.studentThemes?.join(" ") || '-' }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">最长单次学生发言</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-orange" style="width: 200px;"
              >
                {{ parseFloat(period?.studentMaxDuration ?? 0).toFixed(2) }} 秒
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">主要学习风格</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-orange" style="width: 200px;"
              >
                {{ period?.studentStudyStyle || '-' }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">提问模式</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-purple" style="width: 200px;"
              >
                {{ period?.clazzIdrePatterns?.join(" ") || '-' }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">知识传递的主要方式</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-purple" style="width: 200px;"
              >
                {{ period?.clazzKnowledgeTransferMethod || '-' }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">互动的主要模式</td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-purple" style="width: 200px;"
              >
                {{ period?.clazzInteractiveModel || '-' }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td">学习促成的主要方式<span class="red-text-color">【注2】</span></td>
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="right-table-td-purple" style="width: 200px;"
              >
                {{ period?.teacherFacilitationMethod }}
              </td>
            </tr>
            <tr class="right-table-tr">
              <td class="right-table-left-td"></td>
              &lt;!&ndash;              :style="{ marginLeft: index === 0 ? '180px' : '56px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }"&ndash;&gt;
              <td
                  v-for="(period, index) in periodAnalysis?.periods"
                  :key="index"
                  class="font-size-10"
                  style="text-align: left;"
              >
&lt;!&ndash;                {{ index === periodAnalysis?.periods.length - 1 ? period?.stopAudioTime : period?.startAudioTime }}&ndash;&gt;
                {{period?.startAudioTime }}
              </td>
            </tr>
            </tbody>
          </table>-->
                </div>

                <div class="category-labels">
                    <div style="width: 258px; margin: 0 auto">
                        <span class="diamonds-green"></span>
                        <span class="font-size-10 diamonds-green-text">授课主题</span>
                        <span class="diamonds-orange"></span>
                        <span class="font-size-10 diamonds-orange-text">教学效果</span>
                        <span class="diamonds-purple"></span>
                        <span class="font-size-10 diamonds-purple-text">教学方法</span>
                    </div>
                </div>
            </section>

            <section class="summary-section" style="clear: both">
                <h4 style="margin-top: 50px; font-size: 17px">教学效果序列分析小结：</h4>
                <!--        <p id="periodAnalysisSummaryText" v-html="periodAnalysis.summaryText" class="indented-text line-height font-size-16"></p>-->
                <p class="indented-text line-height font-size-16" v-if="periodAnalysis?.summaryText">
                    <template v-for="(segment, index) in periodAnalysis?.summaryText">
                        <!-- 普通文本 -->
                        <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                        <!-- 高亮文本（带样式） -->
                        <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                    </template>
                </p>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 2 —</div>
            </footer>
        </div>

        <!--  第四页，课堂特点  -->
        <div class="page-container" data-order="4">
            <header>
                <h3>（三）课堂特点</h3>
            </header>

            <section class="table-section" style="margin-top: 60px">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>特点</th>
                            <th>评价</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in classroomFeatures" :key="index">
                            <td>{{ item.sequence }}</td>
                            <td>{{ item.characteristic }}</td>
                            <td v-if="item.rating === true">
                                <img style="width: 20px; height: 20px" src="../../assets/imgs/ThumbsUp.png" alt="" />
                            </td>
                            <td v-if="item.rating === false"></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="summary-section" style="margin-top: 60px">
                <h4 style="font-size: 17px">
                    <img style="width: 20px; height: 20px" src="../../assets/imgs/ThumbsUp.png" alt="" />
                    表示教师表现较突出的方面。其中，部分特别指标的含义如下：
                </h4>
                <ul style="margin-top: 20px; font-size: 16px">
                    <li style="margin-bottom: 10px; line-height: 22px">
                        <span style="color: #f39d3c">学生学习风格的多样性展现：</span>让更多知行学习类型得到照顾。
                    </li>
                    <li style="margin-bottom: 10px; line-height: 22px">
                        <span style="color: #f39d3c">学生充分表达：</span>让单个学生有 10-30 秒的发言机会。
                    </li>
                    <li style="margin-bottom: 10px; line-height: 22px">
                        <span style="color: #f39d3c">教学风格兼顾性、教师推动有效学习：</span
                        >教师均衡的教学风格利于学生思维激发，恰当的推动方法利于学习发生。
                    </li>
                </ul>
            </section>
            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 3 —</div>
            </footer>
        </div>

        <!--  第五页，教与学基本参数  -->
        <div class="page-container" data-order="5">
            <header>
                <h3>（四）教与学基本参数</h3>
                <h4 style="margin-top: 30px; float: left; font-size: 17px">1. 教师的教学特点</h4>
            </header>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 120px">指标</th>
                            <th style="width: 120px">分值</th>
                            <th style="width: 120px">参考值</th>
                            <th>指标说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-size-14 td-text-center">教师讲话总时</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.stTotalTeacher?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.stTotalTeacher?.referene }} 分钟
                            </td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">授课语速</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.speechSpeed?.value }}
                                字/分钟
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.speechSpeed?.referene }}
                                字/分钟
                            </td>
                            <td rowspan="2" class="font-size-12 font-color-c6c6c6">
                                教师授课语速及凝炼度，会影响学生是否能及时 处理教师所传递的信息。凝炼度数值越大表示单
                                位时间内教师传递给学生的信息量越大。如果教 师语速过快同时语言凝炼度较高，会导致学生无
                                法跟上教师思路。课堂中教师习惯性的重复话语 会使凝炼度降低<span class="red-text-color"
                                    >【注3】。</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">语言凝练度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.averageInformation?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.averageInformation?.referene }}
                                比特/分钟
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">积极性话语次数</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.sentimentPositive?.value.split(':')[1] }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.sentimentPositive?.referene }}
                            </td>
                            <td rowspan="2" class="font-size-12 font-color-c6c6c6">
                                教师情感饱满程度和比较强烈的积极话语次数， 会吸引学生在课堂中更加投入，也反映出教学过
                                程中教师的投入程度和对学生激励程度。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">情感饱满度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis.sentimentSaturation?.value?.split(':')[1] }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.sentimentSaturation?.referene }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">课堂负极氛围</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.sentiment?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.sentiment?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6">
                                与教师进行课堂整顿和管控的程度相关，也与授 课内容蕴含的情感相关。通常此类指标较高时，
                                教师的管理风格偏严厉，容易让学生产生压迫感， 不敢表达真实想法。教师在和学生的互动中可以
                                增加鼓励和认可（参考1-4“积极话语次数”）， 来提升课堂互动质量和学生的投入程度。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">想象力</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.semanticalRichness?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.semanticalRichness?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6">
                                想象力：数值越大想象力越大，想象力高的场景 更容易给学生留下深刻的印象，强化学生对内容
                                的记忆和迁移。通常将两个关联度越低的事务联 系起来，或者跨学科跨领域，则想象力指标就会
                                提高。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">思维激发开放性</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.clazzOpenness?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.clazzOpenness?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6">
                                教师在授课时激励学生从不同角度思考，如“还 有没有不同的想法？”，以有意义的次数来衡量
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">强化知识记忆倾向</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                <!--              {{ teacherTeachAnalysis?.clazzStructure?.value ? teacherTeachAnalysis?.clazzStructure?.value.split('').join('<br>') : '-'}}-->
                                <span
                                    v-html="
                                        teacherTeachAnalysis?.clazzStructure?.value
                                            ? teacherTeachAnalysis.clazzStructure.value.split(' ').join('<br>')
                                            : '-'
                                    "
                                ></span>
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">-</td>
                            <td class="font-size-12 font-color-c6c6c6">
                                课堂教学常包含知识重温、学习目标设定和课堂 总结，研究表明这些与强化知识记忆倾向正相关；
                                如果与1-8“思维激发开放性”配合，会取得更 全面的效果。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">常用口头禅</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.petPhrase?.value || '未检测到明显的口头禅' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.petPhrase?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6">
                                教师的口头禅，因为不自觉使用，会影响教学效 率甚至无意识对学生形成干扰。通常在语文课中，
                                由于课文中经常会出现一些类似口头禅的语气 词，在参考此指标时需注意区分。口头禅也会降
                                低教师的语言凝炼度。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">知行教学风格</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.kaTeachStyleIntensity?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ teacherTeachAnalysis?.kaTeachStyleIntensity?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6">
                                知行教学风格的强烈程度，反映了教师知行教学 个性的鲜明程度。过于强烈的个性，会使教师难
                                以兼顾不同风格的学生<span class="red-text-color">【注4】。</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="summary-section">
                <h5 style="font-size: 16px">教师本堂课的教学特点小结：</h5>
                <!--        <p v-html="teacherTeachAnalysis?.summaryText" class="indented-text"></p>-->
                <p class="summary-text text-indent-2em" v-if="teacherTeachAnalysis?.summaryText">
                    <template v-for="(segment, index) in teacherTeachAnalysis?.summaryText">
                        <!-- 普通文本 -->
                        <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                        <!-- 高亮文本（带样式） -->
                        <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                    </template>
                </p>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 4 —</div>
            </footer>
        </div>

        <!--  第六页，课堂反应  -->
        <div class="page-container" data-order="6">
            <header>
                <h4 style="margin-top: 60px; float: left; font-size: 17px">2. 学生的课堂反应</h4>
            </header>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th colspan="2" style="width: 300px">指标</th>
                            <th style="width: 160px">分值</th>
                            <th style="width: 300px">指标说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                rowspan="7"
                                class="font-size-14"
                                style="
                                    width: 40px;
                                    vertical-align: middle;
                                    writing-mode: vertical-lr;
                                    text-orientation: upright;
                                    padding-top: 28%;
                                "
                            >
                                学生发言情况
                            </td>
                            <td class="font-size-14 td-text-center">发言总时长</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.totalSpeechDuration?.value }}
                            </td>
                            <td class="font-size-14">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">发言主题的高频词</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.speechTheme?.value }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                学生课堂知识兴奋点或教师引导的学生关注点。 所有学生发言提及的前几个高频主题。结合教师
                                授课知识路径，了解学生关注重点，可以分析课 堂知识引导是否和教师期望一致。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">发言人次</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.totalSpeechCount?.value }}
                            </td>
                            <td class="font-size-14 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">发言总字数</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.totalSpeechWords?.value }}
                            </td>
                            <td class="font-size-12 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">发言平均时长</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.speechDurationMean?.value }} 秒
                            </td>
                            <td class="font-size-12 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">发言的充分表达量</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ studentAnalysis?.speechAdequateExpression?.value }}次
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">学生发言在10-30秒的次数</td>
                        </tr>
                        <!-- 发言时长分布 -->
                        <tr>
                            <td colspan="2" class="font-size-14 td-text-center">
                                发言时长分布
                                <br />
                                <img
                                    v-if="studentAnalysis.speechDistribution.chart.imageUri"
                                    style="margin-top: 10px"
                                    :width="studentAnalysis.speechDistribution.chart.width"
                                    :height="studentAnalysis.speechDistribution.chart.height"
                                    :src="studentAnalysis.speechDistribution.chart.imageUri"
                                    alt="发言时长分布图"
                                />
                            </td>
                            <!-- 合并两列 -->
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                时长分布图中，横轴表示学生发言时长分段，纵 轴表示在对应时长中学生发言的次数。2秒以内
                                （紫色）多表示学生对老师封闭性提问的响应 （如：好不好？是多少？等类似提问），学生被动
                                跟进教师的授课进度，难以引发学生的深入思考。 4-30 秒区间（绿色，尤其是10-30秒）表明，在
                                授课过程中，教师能有效鼓励学生主动思考，同 时学生能有机会完整地表达个人想法。30秒以上，
                                多表示学生在朗读或播放多媒体内容。
                            </td>
                        </tr>
                        <tr>
                            <td
                                colspan="2"
                                style="text-align: center; vertical-align: middle"
                                class="font-size-14 td-text-center"
                            >
                                学生情感体验
                            </td>
                            <td class="green-text-color font-size-14 td-text-center">
                                <!--              正极:00:01:41
                            <br>
                            中性:00:01:07
                            <br>
                            负极:00:01:30-->
                                <div v-if="studentAnalysis?.speechSentiment?.value">
                                    <p
                                        v-for="(value, index) in studentAnalysis?.speechSentiment?.value.split(' ')"
                                        :key="index"
                                    >
                                        {{ value }}
                                    </p>
                                </div>
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                正极表示学生课堂情绪比较积极，负极表示学生 课堂情绪比较忧伤焦虑，用相应情感的累计时长
                                来表示。教师需要根据课堂教学的情感价值观目 标定位，检查目标达成情况。
                            </td>
                        </tr>
                        <!-- 学习风格 -->
                        <tr>
                            <td
                                colspan="2"
                                style="text-align: center; vertical-align: middle"
                                class="font-size-14 td-text-center"
                            >
                                知行学习风格
                            </td>
                            <td class="green-text-color font-size-14 td-text-center">
                                <!--              能动型:13%
                            <br>
                            现象型:28%
                            <br>
                            哲理型:38%
                            <br>
                            感悟型:21%-->
                                <div v-if="studentAnalysis?.studyStyles?.value">
                                    <p
                                        v-for="(value, index) in studentAnalysis?.studyStyles?.value.split(' ')"
                                        :key="index"
                                    >
                                        {{ value }}
                                    </p>
                                </div>
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                全部发言学生呈现的学习风格百分比分布，根据 学习发生的知行理论，一般来说若兼顾了四种类
                                型则说明教师能够在课堂中有效激发各种学习风 格的学生。教师可根据教学设计和学科逻辑有意
                                识地加大激发某类学习风格。
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="summary-section">
                <h5 style="font-size: 16px">学生的课堂反应特点小结：</h5>
                <!--        <p v-html="studentAnalysis?.summaryText" class="indented-text"></p>-->
                <p class="summary-text text-indent-2em" v-if="studentAnalysis?.summaryText">
                    <template v-for="(segment, index) in studentAnalysis?.summaryText">
                        <!-- 普通文本 -->
                        <span v-if="segment.type === 'text'" :key="index">{{ segment.content }}</span>
                        <!-- 高亮文本（带样式） -->
                        <span v-else :key="index" :class="segment.type">{{ segment.content }}</span>
                    </template>
                </p>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 5 —</div>
            </footer>
        </div>

        <!--  第七页，语言正面导向  -->
        <div class="page-container" data-order="7">
            <header>
                <h2>第二部分 教师分析</h2>
                <h3>（一）语言的正面导向</h3>
            </header>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 150px">指标</th>
                            <th style="width: 120px">分值</th>
                            <th style="width: 120px">参考值</th>
                            <th>指标说明</th>
                        </tr>
                    </thead>
                    <tbody v-if="Object.keys(languageOriented).length > 0">
                        <tr>
                            <td class="font-size-14 td-text-center">授课语速</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.speechSpeed?.value }} 字/分钟
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ languageOriented?.speechSpeed?.referene }}
                                字/分钟
                            </td>
                            <td rowspan="2" class="font-size-12 font-color-c6c6c6 td-text-center">
                                教师授课语速及凝炼度，会影响学生是否能及时 处理教师所传递的信息。凝炼度数值越大表示单
                                位时间内教师传递给学生的信息量越大。如果教 师语速过快同时语言凝炼度较高，会导致学生无
                                法跟上教师思路。课堂中教师习惯性的重复话语 会使凝炼度降低<span class="red-text-color"
                                    >【注3】。</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">语言凝练度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.averageInformation?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ languageOriented?.averageInformation?.referene }}
                                比特/分钟
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">积极话语次数</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.sentimentPositive?.value?.split(':')[1] }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ languageOriented?.sentimentPositive?.referene }}
                            </td>
                            <td rowspan="2" class="font-size-12 font-color-c6c6c6 td-text-center">
                                教师情感饱满程度和比较强烈的积极话语次数， 会吸引学生在课堂中更加投入，也反映出教学过
                                程中教师的投入程度和对学生激励程度。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">情感饱和度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.sentimentSaturation?.value?.split(':')[1] }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ languageOriented?.sentimentSaturation?.referene }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">教师引述学生情况</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.idreQuote?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">-</td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">对学生及时评价反馈</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ languageOriented?.idreSimple ? '良好' : '偏少' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">-</td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="knowledge-graph-section">
                <header>
                    <h3>（二）授课知识点关联</h3>
                </header>

                <div style="width: 100%; margin-top: 30px; margin-bottom: 10px">
                    <!-- 右侧表格 -->
                    <div class="right-table" v-if="knowledgeAssociations && knowledgeAssociations.length > 0">
                        <div v-for="(chunk, chunkIndex) in chunkKnowledgeAssociations" :key="chunkIndex">
                            <table>
                                <tbody>
                                    <tr class="right-table-tr">
                                        <td class="right-table-left-td1">授课主题</td>
                                        <td
                                            v-for="(association, index) in chunk"
                                            :key="index"
                                            class="right-table-td-green"
                                        >
                                            {{ association?.clazzThemes?.join(' ') || '-' }}
                                        </td>
                                    </tr>
                                    <tr class="right-table-tr">
                                        <td class="right-table-left-td1">
                                            教师发言相关度<span class="red-text-color">【注1】</span>
                                        </td>
                                        <td
                                            v-for="(association, index) in chunk"
                                            :key="index"
                                            class="right-table-td-orange"
                                        >
                                            {{ parseFloat(association?.studentSpeechRelevancy).toFixed(2) || '-' }}
                                        </td>
                                    </tr>
                                    <tr class="right-table-tr">
                                        <td class="right-table-left-td1">学生发言主题</td>
                                        <td
                                            v-for="(association, index) in chunk"
                                            :key="index"
                                            class="right-table-td-orange"
                                        >
                                            {{ association?.studentThemes?.join(' ') || '-' }}
                                        </td>
                                    </tr>
                                    <tr class="right-table-tr">
                                        <td class="right-table-left-td1"></td>
                                        <td
                                            v-for="(association, index) in chunk"
                                            :key="index"
                                            style="text-align: left; position: relative; left: -20px"
                                        >
                                            {{ association?.startAudioTime }}
                                        </td>
                                        <td style="text-align: left; position: relative; left: -20px">
                                            {{ chunk[chunk.length - 1]?.stopAudioTime }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--            <table>
              <tbody>
              <tr class="right-table-tr">
                &lt;!&ndash;                <td class="right-table-td-green">{{ knowledgeAssociations[0].clazzThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-green">{{ knowledgeAssociations[1].clazzThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-green">{{ knowledgeAssociations[2].clazzThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-green">{{ knowledgeAssociations[3].clazzThemes?.join(" ") }}</td>&ndash;&gt;
                <td class="right-table-left-td1">授课主题</td>
                <td v-for="(association, index) in knowledgeAssociations" :key="index" class="right-table-td-green">
                  {{ association?.clazzThemes?.join(" ") || '-' }}
                </td>
              </tr>
              <tr class="right-table-tr">
                &lt;!&ndash;                <td class="right-table-td-orange">&ndash;&gt;
                &lt;!&ndash;                  {{ parseFloat(knowledgeAssociations[0].studentSpeechRelevancy).toFixed(2) }}&ndash;&gt;
                &lt;!&ndash;                </td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">&ndash;&gt;
                &lt;!&ndash;                  {{ parseFloat(knowledgeAssociations[1].studentSpeechRelevancy).toFixed(2) }}&ndash;&gt;
                &lt;!&ndash;                </td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">&ndash;&gt;
                &lt;!&ndash;                  {{ parseFloat(knowledgeAssociations[2].studentSpeechRelevancy).toFixed(2) }}&ndash;&gt;
                &lt;!&ndash;                </td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">&ndash;&gt;
                &lt;!&ndash;                  {{ parseFloat(knowledgeAssociations[3].studentSpeechRelevancy).toFixed(2) }}&ndash;&gt;
                &lt;!&ndash;                </td>&ndash;&gt;
                <td class="right-table-left-td1">教师发言相关度<span class="red-text-color">【注1】</span></td>
                <td v-for="(association, index) in knowledgeAssociations" :key="index" class="right-table-td-orange">
                  {{ parseFloat(association?.studentSpeechRelevancy).toFixed(2) || '-' }}
                </td>
              </tr>
              <tr class="right-table-tr">
                &lt;!&ndash;                <td class="right-table-td-orange">{{ knowledgeAssociations[0].studentThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">{{ knowledgeAssociations[1].studentThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">{{ knowledgeAssociations[2].studentThemes?.join(" ") }}</td>&ndash;&gt;
                &lt;!&ndash;                <td class="right-table-td-orange">{{ knowledgeAssociations[3].studentThemes?.join(" ") }}</td>&ndash;&gt;
                <td class="right-table-left-td1">学生发言主题</td>
                <td v-for="(association, index) in knowledgeAssociations" :key="index" class="right-table-td-orange">
                  {{ association?.studentThemes?.join(" ") || '-' }}
                </td>
              </tr>
              <tr class="right-table-tr">
                <td class="right-table-left-td1"></td>
                <td v-for="(association, index) in knowledgeAssociations" :key="index" style="text-align: left;position: relative;left: -20px;">
&lt;!&ndash;                  {{
                    index === knowledgeAssociations.length - 1 ? association?.stopAudioTime : association?.startAudioTime
                  }}&ndash;&gt;
                  {{association?.startAudioTime}}
                </td>
                <td style="text-align: left;position: relative;left: -20px;">
                  {{knowledgeAssociations[knowledgeAssociations.length - 1]?.stopAudioTime}}
                </td>
              </tr>
              </tbody>
            </table>-->
                    </div>
                </div>
                <!-- 分类标注 -->
                <div class="category-labels">
                    <div style="width: 160px; margin: 0 auto">
                        <span class="diamonds-green"></span>
                        <span class="font-size-10 diamonds-green-text">授课主题</span>
                        <span class="diamonds-orange"></span>
                        <span class="font-size-10 diamonds-orange-text">教学效果</span>
                    </div>
                </div>
            </section>

            <section class="summary-section">
                <h4 class="font-size-17">知识图谱分析</h4>
                <p>整堂课知识图谱：</p>
                <div class="graph-container" ref="graphContainer" v-if="Object.keys(totalGraph).length > 0">
                    <!--    :style="getGraphBubbleStyle(item,index)"      -->
                    <!--          <div
                        v-for="(item, index) in totalGraph?.words"
                        :key="index"
                        class="bubble"
                    >
                      &lt;!&ndash;            <span :style="getGraphTextStyle(item)">{{ item.word }}</span>&ndash;&gt;
                      <span style="font-size: 14px;color: #8a837e;">{{ item.word }}</span>
                    </div>-->
                    <img style="margin: 0 auto" height="300px" :src="totalGraph.chart.imageUri" alt="发言时长分布图" />
                </div>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 6 —</div>
            </footer>
        </div>

        <!--  第八页，分时知识图谱  -->
        <div class="page-container" data-order="8">
            <section class="summary-section" style="width: 100%; height: 56%">
                <p>分时知识图谱：</p>
                <div class="margin-top-30 graph">
                    <div class="graph-four"></div>
                    <!--          <div class="graph-item">
                      <div class="graph-img">
                        <img :src="graphs[0].chart.imageUri" alt="发言时长分布图"/>
                      </div>
                      <div class="graph-time">
                        <span
                            style="width: 160px;margin: 0 auto;display: block">{{ graphs[0].startTime }} - {{
                            graphs[0].stopTime
                          }}</span>
                      </div>
                    </div>
                    <div class="graph-item">
                      <div class="graph-img">
                        <img :src="graphs[1].chart.imageUri" alt="发言时长分布图"/>
                      </div>
                      <div class="graph-time">
                        <span>{{ graphs[1].startTime }} - {{ graphs[1].stopTime }}</span>
                      </div>
                    </div>
                    <div class="graph-item">
                      <div class="graph-img">
                        <img :src="graphs[2].chart.imageUri" alt="发言时长分布图"/>
                      </div>
                      <div class="graph-time">
                        <span>{{ graphs[2].startTime }} - {{ graphs[2].stopTime }}</span>
                      </div>
                    </div>
                    <div class="graph-item">
                      <div class="graph-img">
                        <img :src="graphs[3].chart.imageUri" alt="发言时长分布图"/>
                      </div>
                      <div class="graph-time">
                        <span>{{ graphs[3].startTime }} - {{ graphs[3].stopTime }}</span>
                      </div>
                    </div>-->
                    <div v-for="(graph, index) in graphs" :key="index" class="graph-item">
                        <div class="graph-img">
                            <img :src="graph?.chart?.imageUri" alt="发言时长分布图" />
                        </div>
                        <div class="graph-time">
                            <span> {{ graph?.startTime }} - {{ graph?.stopTime }} </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 7 —</div>
            </footer>
        </div>

        <!--  第九页，四和分析  -->
        <div class="page-container" data-order="9">
            <header>
                <h3>（三）启发性和创造力激发</h3>
            </header>

            <section class="knowledge-graph-section">
                <!--          <img src="" alt="Knowledge Graph"/>-->
            </section>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 160px" class="text-align">指标</th>
                            <th style="width: 80px" class="text-align">分值</th>
                            <th style="width: 80px" class="text-align">参考值</th>
                            <th class="text-align">指标说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-size-14 td-text-center">教师接纳和鼓励学生的比率</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{
                                    enlighten?.teacherAcceptance?.value
                                        ? parseFloat(enlighten?.teacherAcceptance?.value).toFixed(2)
                                        : '-'
                                }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.teacherAcceptance?.reference ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                接纳和鼓励学生的话语时间（T1+T2）占教师话语时间（T1+T2+…+T7）的比例
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">教师接受或延申学生想法的情况</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ enlighten?.teacherAcceptanceStudentIdea?.value ?? '-' }} 次
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.teacherAcceptanceStudentIdea?.reference ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">教师正面回应学生的比率</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ enlighten?.teacherPositiveResponse?.value ?? '-' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.teacherPositiveResponse?.reference ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                亦称教师反应比率,教师对学生的观念和感觉加以反应的话语时间(T1+T2+T3)，占教师与教学无直接相关的话语时间（T1+T2+T3+T6+T7）的比率。数值越高，表示教师越能回应学生的观念和感觉
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">激励学生主动参与</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ enlighten?.fiasMotivateStudent?.value ?? '-' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.fiasMotivateStudent?.referene ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                用教师接纳学生情感、称赞、接受学生想法、发出提问（弗兰德斯类1，2，3，4）的时间片段占比来衡量。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">给予学生思考讨论再回答问题</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ enlighten?.discussions?.value ? enlighten?.discussions?.value + '次' : '-' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.discussions?.reference ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">教师善用追问</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ enlighten?.fiasQuestion?.value ? enlighten?.fiasQuestion?.value + '次' : '-' }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ enlighten?.fiasQuestion?.reference ?? '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h4 style="font-size: 17px" class="margin-top-60">四何分析</h4>
            </section>

            <section class="charts-section">
                <div class="charts-section-four">
                    <div class="chart-item charts-section-one">
                        <p style="width: 260px; margin: 0 auto">1.教师课堂投放信息的四何分布情况</p>
                        <!--            :width="clazzDistributionChart.width" :height="clazzDistributionChart.height" -->
                        <img
                            v-if="clazzDistributionChart?.imageUri"
                            style="width: 300px; height: 300px; margin: 10px 0 0 30px"
                            :src="clazzDistributionChart?.imageUri"
                            alt="教师课堂投放信息的四何分布图"
                        />
                    </div>
                    <div class="chart-item charts-section-one">
                        <p style="width: 260px; margin: 0 auto">2.课堂信息中问答类的四何分布情况</p>
                        <img
                            v-if="qaDistributionChart?.imageUri"
                            style="width: 300px; height: 300px; margin: 10px 0 0 30px"
                            :src="qaDistributionChart?.imageUri"
                            alt="课堂信息中问答类的四何分布图"
                        />
                    </div>
                </div>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 8 —</div>
            </footer>
        </div>

        <!--  第十页，想象力激发  -->
        <div class="page-container" data-order="10">
            <section class="interaction-section">
                <h4 style="font-size: 17px">师生互动情况</h4>
                <div class="interaction-data">
                    <div class="left-section">
                        <div class="info-item">
                            <span class="label font-size-16">教师时长：</span
                            ><span class="value font-size-16">{{ stInteraction?.totalTeacher }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label font-size-16">学生时长：</span
                            ><span class="value font-size-16">{{ stInteraction?.totalStudent }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label font-size-16">{{ stInteraction?.desc }}</span>
                        </div>
                    </div>
                    <div class="right-section">
                        <div class="info-item">
                            <span class="label font-size-16">互动次数：</span
                            ><span class="value font-size-16">{{ stInteraction?.numInteractions }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label font-size-16">师生互动比（师/生）：</span
                            ><span class="value font-size-16">{{
                                parseFloat(stInteraction?.ratioValue).toFixed(2)
                            }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="curve-description">
                <div style="width: 50%; float: left">
                    <img
                        style="margin-top: 10px; width: 300px; height: 300px"
                        :src="stInteraction.chart.imageUri"
                        alt="师生互动情况"
                    />
                </div>
                <div style="width: 50%; float: left; margin-top: 20px; font-size: 16px; line-height: 1.5">
                    <!--    <span class="red-text-color">【注 5】</span>      -->
                    <p>师生互动曲线描述的是老师和学生的互动情况。</p>
                    <ul>
                        <li>沿横轴方向的线段代表老师在讲话，沿纵轴方向的线段代表学生在讲话；</li>
                        <li>当曲线倾斜角小于 45 度时，表示老师活动占多数；倾斜角大于 45 度时，学生活动占多数；</li>
                        <li>当某段倾斜角约 45 度时，表示在此段时间内老师学生互动充分。</li>
                    </ul>
                </div>
            </section>

            <section class="margin-top-60">
                <h4 style="font-size: 17px">想象力激发</h4>
            </section>

            <section class="scatter-plot-section">
                <div
                    style="font-size: 16px; width: 100%; height: 120px; background-color: #fdf6ed; border-radius: 10px"
                >
                    <p style="height: 5px"></p>
                    <p style="margin-left: 20px; margin-top: 20px">
                        本指标反映授课用语的发散程度，数值越大表示越发散，用语越有想象力。
                    </p>
                    <p style="margin-left: 20px">
                        根据数据的概率分布，本次课想象力激发较大。本次课平均想象力激发：
                        <span class="value">
                            {{ parseFloat(timeDistributed.mean).toFixed(2) }} </span
                        >。
                    </p>
                    <p style="margin-left: 20px; color: #b2b1c2">
                        参考值：《物理学的进化》的发散程度为：<span>{{ timeDistributed?.low }}</span
                        >；《三体》的发散程度为：<span>{{ timeDistributed?.high }}</span
                        >。
                    </p>
                </div>

                <img
                    style="margin-top: 10px; width: 100%; height: 200px"
                    :src="timeDistributed.chart.imageUri"
                    alt="想象力激发"
                />
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 9 —</div>
            </footer>
        </div>

        <div class="page-container" data-order="11">
            <section class="ire-analysis-section margin-top-40">
                <h4 style="font-size: 17px">“问-答-评”结构 (IRE) 互动分析</h4>
                <p style="font-size: 16px; line-height: 1.5">
                    I：教师发动提问，R：学生响应，D：学生讨论思考，E：教师评价反馈。教师发动提问
                    I，根据发动的问题分为五种：若何 (What if)、如何 (How)、是何 (What)、为何 (Why)、其他
                    (Other)。是何，多为封闭型问题；若何、如何、为何等则多为开放型问题。教师评价 E，分为三种：否定
                    (-)、肯定 (+)、引述 (~)。
                </p>
                <p style="font-size: 16px; line-height: 1.5">
                    通常来说，开放问题非简单否定的 IDRE 模式，更能激发学生带着问题学习的热情。过多封闭问题的简单型
                    IRE，因为会导致教师威信呈现过强，而影响学生思想的参与积极性。
                </p>
                <ul>
                    <li>
                        <h5 style="font-size: 16px">1、简单型（{{ idre?.simples?.length }} 次）</h5>
                    </li>
                    <ul>
                        <li v-for="(item, index) in idre?.simples" :key="index">
                            <span>{{ item.startSecond }}</span>
                            <span>--</span>
                            <span>{{ item.stopSecond }}</span>
                            <span>：</span>
                            <span v-for="(value, index) in item.states" :key="index">
                                <span>{{ value.code }}</span>
                                <span
                                    v-if="value.subCode && value.subCode.length > 0"
                                    style="font-size: 12px; position: relative"
                                    class="superscript"
                                    >{{ value.subCode }}</span
                                >
                                <span v-if="value.subCode && value.subCode.length > 1">&nbsp;</span>
                            </span>
                        </li>
                    </ul>
                    <li>
                        <h5 style="font-size: 16px">2、追问型（{{ idre?.repeats?.length }} 次）</h5>
                    </li>
                    <ul>
                        <li v-for="(item, index) in idre?.repeats" :key="index">
                            <span>{{ item.startSecond }}</span>
                            <span>--</span>
                            <span>{{ item.stopSecond }}</span>
                            <span>：</span>
                            <span v-for="(value, index) in item.states" :key="index">
                                <span>{{ value.code }}</span>
                                <span
                                    v-if="value.subCode && value.subCode.length > 0"
                                    style="font-size: 12px; position: relative"
                                    class="superscript"
                                    >{{ value.subCode }}</span
                                >
                                <span v-if="value.subCode && value.subCode.length > 1">&nbsp;</span>
                            </span>
                        </li>
                    </ul>
                    <li>
                        <h5 style="font-size: 16px">
                            3、学生讨论思考再答型（{{ idre?.discussions?.length }} 次），学生平均练习思考时间
                            {{ idre?.discussionMeanDuration }} 秒
                        </h5>
                    </li>
                    <ul>
                        <li v-for="(item, index) in idre?.discussions" :key="index">
                            <span>{{ item.startSecond }}</span>
                            <span>--</span>
                            <span>{{ item.stopSecond }}</span>
                            <span>：</span>
                            <span v-for="(value, index) in item.states" :key="index">
                                <span>{{ value.code }}</span>
                                <span
                                    v-if="value.subCode && value.subCode.length > 0"
                                    style="font-size: 12px; position: relative"
                                    class="superscript"
                                    >{{ value.subCode }}</span
                                >
                                <span v-if="value.subCode && value.subCode.length > 1">&nbsp;</span>
                            </span>
                        </li>
                    </ul>
                </ul>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 10 —</div>
            </footer>
        </div>

        <!--  第十二页，课堂能效覆盖面  -->
        <div class="page-container" data-order="12">
            <header>
                <h3>（四）课堂效能覆盖面</h3>
            </header>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 140px">指标</th>
                            <th style="width: 80px">分值</th>
                            <th style="width: 100px">参考值</th>
                            <th>指标说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-size-14 td-text-center">教师推动有效学习程度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ facilitationMethod?.teacherPromoteEffectiveLearningLevel?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ facilitationMethod?.teacherPromoteEffectiveLearningLevel?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                根据学习发生的知行理论，为何、如何方式是促进学生产生内化建构、思想练习的重要方法，适当采用这些方法会提高分值，但过多使用也会产生钝化，提升速度会下降。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">课程结构设计的四维清晰度</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                {{ facilitationMethod?.kaBigTotalCount?.value }}
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ facilitationMethod?.kaBigTotalCount?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                具有四何典型特征的知识传递方式，包括提问或启示：用四何的总数来度量；
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">课程结构设计的四维均衡情况</td>
                            <td class="green-text-color font-size-14 td-text-center">
                                <!--              <ul>
                              <li>若何:30</li>
                              <li>为何:22</li>
                              <li>是何:47</li>
                              <li>如何:20</li>
                            </ul>-->
                                <div v-if="facilitationMethod?.kaDesign?.value">
                                    <p
                                        v-for="(value, index) in facilitationMethod?.kaDesign?.value.split(' ')"
                                        :key="index"
                                    >
                                        {{ value }}
                                    </p>
                                </div>
                            </td>
                            <td class="orange-text-color font-size-14 td-text-center">
                                {{ facilitationMethod?.kaDesign?.referene }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                课堂知识传递方式，用若何 (what if)、为何 (why)、是何 (what)、如何 (how)
                                来代表，这并不限于“为何”等之类的提问，而仅仅作为教师课堂知识传递的方式的典型代表。这四种课堂知识传递方式的分布情况，反映了教师在课程设计上对场景设置、原因探索引导、概念抽象概括、知识练习和知识迁移方面的总体规划。教师可以据此检查优化课程设计。同时此指标可以和第一部分“学生学习风格的多样性展现”指标进行比对参照，调整课程设计。因为通常每个学生学习风格是不同的，需要教师在课堂设计时尽可能全面涵盖四何方式以达成更好的授课效果。
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="chart-section margin-top-60">
                <h4 class="font-size-17">知行教学风格</h4>
                <div
                    style="width: 100%; height: 100px; display: flex; background-color: #fdf6ed; border-radius: 10px"
                    class="margin-top-30"
                >
                    <!--          <p style="height: 10px;"></p>-->
                    <p class="font-size-16 line-height" style="padding: 20px">
                        <!--            根据教学风格在各个象限的概率分布，本课堂侧重于<span class="orange font-weight">概念→思想练习</span>的方式，偏向激发<span
              class="orange font-weight">现实型学习风格</span>的学生。红色菱形小方块反映了教师的内在风格倾向。-->
                        {{ kaVo?.majorQuarterDesc }}
                    </p>
                </div>
                <div class="chart-section-data">
                    <!--      class="chart-section-right"    -->
                    <div style="float: left; flex: 1; box-sizing: border-box">
                        <img
                            style="margin-top: 10px; width: 380px; height: 330px"
                            :src="kaVo.chart.imageUri"
                            alt="想象力激发"
                        />
                    </div>
                    <div class="chart-section-left line-height font-size-16">
                        <p>
                            知行理论通过分析处理信息的方式（横轴从左到右代表从概念到场景），以及处理完信息之后的响应方式（纵轴从下到上代表从内化建构到思想练习），凝练而深刻地刻画老师的教学风格和学习者的风格。教学风格分布越均匀，表示对各类学生的兼顾越好。
                        </p>
                        <p>
                            <span class="font-weight">教学风格强烈程度为</span>：
                            <span class="orange font-weight">{{
                                parseFloat(kaVo?.teachStyleIntensity).toFixed(2)
                            }}</span
                            >（数值越大表示越强烈）。
                        </p>
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 160px" class="text-align-left">教学风格</th>
                                    <th style="width: 100px">百分比</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(quarterName, index) in kaVo?.quarterNames" :key="index">
                                    <td style="width: 160px" class="text-align-left">{{ quarterName }}</td>
                                    <td style="width: 100px; padding-left: 50px" class="text-align-left">
                                        {{ kaVo?.quarterPercentage[index] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 11 —</div>
            </footer>
        </div>

        <!--  第十三页，学生分析  -->
        <div class="page-container" data-order="13">
            <header>
                <h2>第三部分 学生分析</h2>
                <h3 class="margin-top-40">（一）学生学习风格</h3>
            </header>

            <section style="width: 100%; height: 400px">
                <div style="float: left; flex: 1; box-sizing: border-box">
                    <img style="width: 380px; height: 330px" :src="studentKa.chart.imageUri" alt="学生学习风格" />
                </div>
                <div class="chart-section-left line-height">
                    <p class="font-size-16 line-height margin-top-30 indented-text">
                        根据学生学习发生方式的偏向，学习风格划为感悟型、哲理型、现实型、能动型四种。人工智能算法是统计全部发言学生呈现的学习风格百分比分布。
                        根据学习发生的知行理论，一般来说，若兼顾了四种类型，则说明教师能够在课堂中有效激发各种学习风格的学生。
                    </p>
                    <table style="margin-top: 40px; line-height: 1.5">
                        <thead>
                            <tr>
                                <th style="width: 160px" class="text-align-left">
                                    学生学习风格<span class="red-text-color">【注6】</span>
                                </th>
                                <th style="width: 100px">百分比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(styleName, index) in studentKa?.styleNames" :key="index">
                                <td style="width: 160px" class="text-align-left">{{ styleName }}</td>
                                <td style="width: 100px; padding-left: 50px" class="text-align-left">
                                    {{ studentKa?.stylePercentage[index] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <header>
                <h3>（二）课堂参与主动性</h3>
            </header>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 160px">指标</th>
                            <th style="width: 80px">分值</th>
                            <th style="width: 80px">参考值</th>
                            <th>指标说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-size-14 td-text-center">学生发问比率</td>
                            <td class="font-size-14 green-text-color td-text-center">{{ studentFias?.pir?.value }}</td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{ studentFias?.pir?.reference }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                学生发问，与学生主动发言正相关。学生主动发言比率，即学生主动引发的话语时间（S2）占学生话语时间（S1+S2）的比率。数值越高，表示学生越勇于主动表达自己的意见。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">学生表达稳定比率</td>
                            <td class="font-size-14 green-text-color td-text-center">{{ studentFias?.pssr?.value }}</td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{ studentFias?.pssr?.reference }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                亦称学生稳定状态区比率。学生说话持续达3秒以上的话语时间，占学生话语时间的比率。数值越高，表示学生的言谈风格越稳定。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">师生问答次数</td>
                            <td class="font-size-14 green-text-color td-text-center">
                                {{ studentFias?.stQaCount?.value }} 次
                            </td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{ studentFias?.stQaCount?.reference ? studentFias?.stQaCount?.reference : '-' }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">
                                教师问问题且学生回答的总次数。
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-14 td-text-center">学生主动发言次数</td>
                            <td class="font-size-14 green-text-color td-text-center-center">
                                {{ studentFias?.studentInitiativeCount?.value }} 次
                            </td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{
                                    studentFias?.studentInitiativeCount?.reference
                                        ? studentFias?.studentInitiativeCount?.reference
                                        : '-'
                                }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                        <tr class="font-size-14 td-text-center">
                            <td class="font-size-14 td-text-center">发言的充分表达量</td>
                            <td class="font-size-14 green-text-color td-text-center">
                                {{ studentFias?.speechAdequateExpression?.value }}
                                次
                            </td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{
                                    studentFias?.speechAdequateExpression?.reference
                                        ? studentFias?.speechAdequateExpression?.reference
                                        : '-'
                                }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">学生发言在10-30秒的次数。</td>
                        </tr>
                        <tr class="font-size-14">
                            <td class="font-size-14 td-text-center">发言总时长</td>
                            <td class="font-size-14 green-text-color td-text-center">
                                {{ studentFias?.totalSpeechDuration?.value }}
                            </td>
                            <td class="font-size-14 orange-text-color td-text-center">
                                {{
                                    studentFias?.totalSpeechDuration?.reference
                                        ? studentFias?.totalSpeechDuration?.reference
                                        : '-'
                                }}
                            </td>
                            <td class="font-size-12 font-color-c6c6c6 td-text-center">-</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 12 —</div>
            </footer>
        </div>

        <!--  第十四页，左右脑激发  -->
        <div class="page-container" data-order="14">
            <header style="margin-top: 40px">
                <h3>（三）左右脑激发</h3>
            </header>

            <section class="brain-stimulation-section">
                <div class="brain-stimulation-top">
                    <p style="margin-left: 40px">
                        左脑时长：<span class="orange">{{ studenLr?.totalLeft }}</span>
                        <span style="margin-left: 200px"
                            >左右脑比例（左/右）<span class="red-text-color">【注5】</span>：
                            <span class="orange">{{ studenLr?.ratioValue }}</span>
                        </span>
                    </p>
                    <p style="margin-left: 40px">
                        右脑时长：<span class="orange">{{ studenLr?.totalRight }}</span>
                    </p>
                    <p style="margin-left: 40px">{{ studenLr?.desc }}</p>
                </div>
                <div>
                    <img style="width: 100%; height: 200px" :src="studenLr.chart.imageUri" alt="综合学习能效" />
                </div>
            </section>

            <header style="margin-top: 40px">
                <h3>（四）学生情感体验</h3>
            </header>

            <section class="emotion-experience-section">
                <div class="emotion-data">
                    <div style="width: 90%; margin: 0 auto">
                        <p>
                            <span
                                >正极时长：<span class="orange">{{ studentSentiment?.totalPos }}</span></span
                            >
                            <span style="margin-left: 80px"
                                >中性时长：<span class="orange">{{ studentSentiment?.totalNeu }}</span></span
                            >
                            <span style="margin-left: 80px"
                                >负极时长：<span class="orange">{{ studentSentiment?.totalNeg }}</span></span
                            >
                        </p>
                    </div>
                </div>
                <div>
                    <img style="width: 100%; height: 200px" :src="studentSentiment.chart.imageUri" alt="综合学习能效" />
                </div>
                <p class="margin-top-30 line-height">
                    正极表示学生课堂情绪比较积极，负极表示学生课堂情绪比较忧伤焦虑，用相应情感的累计时长来表示。教师需要根据课堂教学的情感价值观目标定位，检查目标达成情况。
                </p>
            </section>

            <!-- 页脚，包含页码 -->
            <footer class="footer">
                <div class="page-number">— 13 —</div>
            </footer>
        </div>

        <!--  第十五页，课堂评价量表  -->
        <!--    <div class="page-container" data-order="15">
      <header>
        <h1>第四部分 课堂评价量表</h1>
        <p style="text-align: center;">××学校评课量表</p>
        <p style="text-align: center;">范秋平-八年级道德与法治-《尊重他人》</p>
      </header>

      <table class="evaluation-table" style="width: 100%; border-collapse: collapse;">
        <thead>
        <tr>
          <th>评价维度</th>
          <th>评价指标</th>
          <th>评价细项</th>
          <th>得分/分值</th>
          <th>评语</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td rowspan="4">学为中心</td>
          <td>健康习惯</td>
          <td>
            <ul>
              <li>有效先学，认真完成教学案等预习任务；</li>
              <li>准时候课，准备好学习用品，凝心聚神，进入学习状态；</li>
              <li>课堂上专心致志，符合 SLANT 课堂标准；</li>
              <li>合作展示等礼仪规范，学习行为端正。</li>
            </ul>
          </td>
          <td>6.3/10</td>
          <td>
            张老师：不错；<br/>
            李老师：很好；<br/>
            张老师：不错；
          </td>
        </tr>
        <tr>
          <td>潜层学习</td>
          <td>
            <ul>
              <li>在自主探索中获得知识，体验知识的形成过程；</li>
              <li>合作同行，实现学习效益最大化；</li>
              <li>独立思考、自信表达，主动反思总结，综合思维能力得到强化。</li>
            </ul>
          </td>
          <td>15.1/20</td>
          <td>
            张老师：不错；<br/>
            李老师：很好；
          </td>
        </tr>
        <tr>
          <td>教学准备</td>
          <td>
            <ul>
              <li>
                教（学）案设计合理，体现核心知识、能力目标和素养目标。及时二备，教学策略符合学情，体现积极情绪的引导和分层教学；
              </li>
              <li>做必要的课前技能训练</li>
              <li>提前候课，充分准备教学资源，调整学生情绪以激发学生学习兴趣和热情。</li>
            </ul>
          </td>
          <td>13.5/15</td>
          <td>
            张老师：不错；
          </td>
        </tr>
        <tr>
          <td>课堂建设</td>
          <td>
            <ul>
              <li>
                安排合理的学习任务，提供有针对性的学习资源，激发积极交往，注重课堂中的全面参与和多维互动，达到对学生系统的关注和指导；
              </li>
              <li>适应学生讲解、释疑，展评合一，生成动态教学过程；</li>
              <li>合理开展当堂达标检测活动；</li>
              <li>进行积极的课堂评价与反馈，适时引导学生调控负面情绪，正确运用表扬，注重鼓励努力及品格优势的培育。</li>
            </ul>
          </td>
          <td>13.6/20</td>
          <td>
            ...
          </td>
        </tr>
        <tr>
          <td>积极成效</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
        </tr>
        </tbody>
      </table>

      &lt;!&ndash;      <footer>&ndash;&gt;
      &lt;!&ndash;        <p style="color: orange;">总结：李老师：表现不错</p>&ndash;&gt;
      &lt;!&ndash;      </footer>&ndash;&gt;
      &lt;!&ndash; 页脚，包含页码 &ndash;&gt;
      <footer class="footer">
        <div class="page-number">— 14 —</div>
      </footer>
    </div>-->

        <!--  第十六页，注释内容  -->
        <div class="page-container" data-order="15">
            <header class="margin-top-40">
                <h2>附：注释内容</h2>
            </header>

            <section class="annotation-section margin-bottom-30 margin-top-40">
                <p>
                    <span class="red-text-color">【注 1】</span>
                    师生发言相关度：衡量教师授课与学生发言的相关程度，取值范围 0~1。完全相关则等于
                    1，完全不相关或学生发言过少则等于
                    0。相关度高，表示学生认真听课，能跟随教师授课节奏。相关度低，多数表示学生没有跟随教师授课，也可能表示学生产生了创造性联想。
                </p>
                <p>
                    <span class="red-text-color">【注 2】</span>
                    学习促成方式：按照学习发生的知行理论，学习发生有四种模式，①场景→内化建构，②概念→内化建构，③概念→思想练习，④场景→思想练习；理想教学顺序①、②、③、④循环而上，需基于教学环节和学科逻辑。本处活动片段划分则是基于课堂容量，与通常的教学环节设计可能并不一致。故此处的学习促成方式分析，主要用来呈现多样性，而非顺序性。
                </p>
                <p>
                    <span class="red-text-color">【注 3】</span>
                    凝练度是用单位时间教师讲话所包含的信息量(香农理论)来衡量。
                </p>
                <p>
                    <span class="red-text-color">【注 4】</span>
                    知行教学风格强烈程度：基于教师课堂知识传递联合采用概念抽象（what）—场景假设（what
                    if）—为什么（why）—怎么样（how）四种方式的分布情况，以此计算偏离零点的程度，用来衡量教师传递课堂知识偏向某方式的程度。数值越小表示教师的教学风格能够更好的兼顾不同学习风格的学生，侧面反应教师教学经验的成熟度越高。
                </p>
                <p>
                    <span class="red-text-color">【注 5】</span>
                    授课对学生左右脑激发比例：反映了课堂中教师对学生用脑特征的激发，左脑特征在于逻辑理解、记忆、时间、语言、抑制等，思维具有连续性、延续性和分析性。右脑特征在空间形象记忆、直觉、情感、想像、灵感、顿悟等，思维具有无序性、跳跃性、直觉性。通常语文、音乐、美术类课程对右脑的激发比例较高，写作、数学、物理、化学类课程对左脑激发比例较高。
                </p>
                <p><span class="red-text-color">【注 6】</span>学生的学习风格，已学习发生的知性理论划分为如下 4 类：</p>
                <p>
                    能动型：
                    此类学生直觉快速把握获得的信息（知），关注实用和操作（行）。常表现为善于知识迁移创新、举一反三、开放热情，易于激励合作。如该指标较低，教师可以多设置（如果-怎么样）类的知识场景，照顾该类学生。
                </p>
                <p>
                    现实型：
                    此类学生倾向于从获得的信息里提取抽象概念（知），关注如何应用于实际行动（行）。常表现为擅长分析抽象，做事有条理，务实冷静。如该指标较低，教师可以多设置（概念抽象-怎么作）类的知识场景，照顾该类学生。
                </p>
                <p>
                    哲理型：
                    此类学生倾向于对信息概念化深加工（知），为了探索背后的原因，不太关注有何实用价值（行）。常表现为易被理论和思想吸引，喜追根究底。如该指标较低，教师可以多设置（概念抽象-为什么）类的知识场景，照顾该类学生。
                </p>
                <p>
                    感悟型：
                    此类学生接受信息后不作深度抽象加工（知），倾向直接快速直觉出背后的原因（行）。常表现为艺术倾向，有同情心。如该指标较低，教师可以多设置（如果-为什么）类的知识场景，照顾该类学生。
                </p>
            </section>
        </div>

        <!--  第十七页，注释内容二  -->
        <!--    <div class="page-container" data-order="16">
    </div>-->
    </div>
</template>

<script>
import * as echarts from 'echarts';
import htmlToPdf from '@/components/utils/htmlToPdf';

export default {
    name: 'AiTeacherReportPage',
    data() {
        return {
            // 分析ID
            analysisId: '',
            // 分析类型 1磨课，2评课
            analysisType: 1,
            // 基本信息
            baseInfo: {
                id: 8,
                aiConfigId: '',
                analysisId: '',
                analysisName: '',
                schoolName: '',
                subjectName: '',
                gradeName: '',
                reportNumber: '',
                teacherName: '',
                reportTimeCreated: '',
            },
            // （一）课堂概要 summary  start //////////
            // 课堂整体表现
            integralAnalysis: {
                value: [],
                referene: [],
                summaryText: [],
                fiasSummaryText: [],
                ireSummaryText: [],
                facilitationSummaryText: [],
            },
            intergralAnalysisOption: {
                // color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
                color: ['#A6ADD0', '#F39D3D'],
                title: {
                    text: '',
                },
                legend: {
                    orient: 'horizontal', // 设置图例为水平排列
                    bottom: 10, // 设置图例在底部显示，距离底部10px
                    data: ['常规标准', '本课表现'], // 图例的内容
                },
                radar: [
                    {
                        indicator: [
                            {text: '目标定位', max: 10},
                            {text: '课堂艺术', max: 10},
                            {text: '课堂调控', max: 10},
                            {text: '思维激发', max: 10},
                            {text: '评价反馈', max: 10},
                            {text: '整体发展', max: 10},
                            {text: '合作交流', max: 10},
                            {text: '学习体验', max: 10},
                            {text: '目标达成', max: 10},
                        ],
                        center: ['50%', '50%'],
                        radius: 120,
                        axisName: {
                            color: '#34495e',
                            backgroundColor: '',
                            borderRadius: 3,
                            padding: [3, 5],
                        },
                    },
                ],
                series: [
                    {
                        type: 'radar',
                        radarIndex: 0, // 修改为 0，因为只有一个雷达图
                        data: [
                            {
                                value: [],
                                name: '常规标准',
                                symbol: 'rect',
                                symbolSize: 12,
                                lineStyle: {
                                    type: 'dashed',
                                },
                                /*areaStyle: {
                  color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                    {
                      color: 'rgba(243, 157, 61, 0.1)',
                      offset: 0
                    },
                    {
                      color: 'rgba(243, 157, 61, 0.9)',
                      offset: 1
                    }
                  ])
                },*/
                                label: {
                                    show: false,
                                    formatter: function (params) {
                                        return params.value;
                                    },
                                },
                            },
                            {
                                value: [],
                                name: '本课表现',
                                areaStyle: {
                                    color: 'rgba(243, 157, 61, 0.5)',
                                    /*color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                    {
                      color: 'rgba(166, 173, 208, 0.1)',
                      offset: 0
                    },
                    {
                      color: 'rgba(166, 173, 208, 0.9)',
                      offset: 1
                    }
                  ])*/
                                },
                                label: {
                                    show: false,
                                },
                            },
                        ],
                    },
                ],
            },
            integralAnalysisText: '',
            // 教学效果序列分析
            periodAnalysis: {
                periods: [],
                summaryText: '',
                chunkedPeriods: [],
            },
            characteristicsAnalysis: {
                student4matDiversity: false,
                idreSimple: false,
                idreDiscussion: false,
                idreRepeat: false,
                teacherSpeech: false,
                teacherPromoteEffectiveLearning: false,
                studentExpression: false,
                clazzImagination: false,
                clazzInteraction: false,
                motivateStudent: false,
                clazzKaBalance: false,
            },
            // 课堂特点
            classroomFeatures: [
                {sequence: 1, characteristic: '学生学习风格的多样性展现', rating: false},
                {sequence: 2, characteristic: '教师对学生及时评价反馈', rating: false},
                {sequence: 3, characteristic: '教师给予学生思考讨论再回答问题', rating: false},
                {sequence: 4, characteristic: '教师善用追问', rating: false},
                {sequence: 5, characteristic: '教师语速适中、语言精炼', rating: false},
                {sequence: 6, characteristic: '教师推动有效学习', rating: false},
                {sequence: 7, characteristic: '学生充分表达', rating: false},
                {sequence: 8, characteristic: '课堂想象力丰富', rating: false},
                {sequence: 9, characteristic: '课堂互动充分', rating: false},
                {sequence: 10, characteristic: '激励学生主动参与', rating: false},
                {sequence: 11, characteristic: '教学风格兼顾性', rating: false},
            ],
            // 教师的教学特点
            teacherTeachAnalysis: {},
            // 学生的课堂反应
            studentAnalysis: {
                speechDistribution: {
                    chart: {
                        width: 0,
                        height: 0,
                        imageUri: '',
                    },
                },
            },
            // （一）课堂概要 summary  end //////////
            // --------------------------------------------------------------
            // （二）教师分析 teacher  start //////////
            // 第一张表格
            enlighten: {},
            // 语言的正确导向
            languageOriented: {},
            // 授课知识关联
            knowledgeAssociation: {},
            // 启发性和创造力激发
            inspireCreativity: {},
            // 课堂效能覆盖面
            teacherThought: {},
            // 授课知识点关联序列
            knowledgeAssociations: [],
            chunkKnowledgeAssociations: [],
            // 知识图谱分析
            totalGraph: {
                chart: {
                    imageUri: '',
                },
            },

            positions: [], // 初始化为空数组
            containerWidth: 0, // 容器宽度，将动态设置
            containerHeight: 300, // 容器高度
            gridSpacing: 80, // 气泡之间的间距
            graphs: [],
            // 教师课堂投放信息的四何分布情况
            clazzDistributionChart: {},
            // 课堂信息中问答类的四何分布情况
            qaDistributionChart: {},
            // 师生互动情况
            stInteraction: {
                chart: {
                    imageUri: '',
                },
            },
            // 想象力激发
            timeDistributed: {
                chart: {
                    imageUri: '',
                },
            },
            // “问-答-评”结构（IRE)互动分析
            idre: {
                // 简单型
                simples: [],
                // 追问型
                repeats: [],
                // 学生讨论思考再答型
                discussions: [],
                // “学生讨论思考再答型“ 的学生练习思考时间
                discussionMeanDuration: 0.0,
            },
            // 课堂效能覆盖面-第一张图
            facilitationMethod: {},
            // 想象力激发
            kaVo: {
                chart: {
                    imageUri: '',
                },
            },
            // （二）教师分析 teacher  end //////////
            // --------------------------------------------------------------
            // （三）学生分析 student  start //////////
            studentKa: {
                chart: {
                    imageUri: '',
                },
                imageUri: '',
            },
            // （二）课堂参与主动性
            studentFias: {},
            // （三）左右脑激发
            studenLr: {
                chart: {
                    imageUri: '',
                },
            },
            // （四）学生情感体验wsw
            studentSentiment: {
                chart: {
                    imageUri: '',
                },
            },
            // （三）学生分析 student  end //////////

            // 课堂整体表现数据
            integralAnalysisData: {},
            // 课堂概要-课堂整体表现: 参考值
            integralAnalysisReference: {},
            // --------------------------------------------------------------
        };
    },
    created() {},
    mounted() {
        const router = this.$route.query;
        if (router.analysisId === '' || router.analysisId.length === 0) {
            return;
        }
        this.analysisId = router.analysisId;
        this.analysisType = router.analysisType;

        /*if (router.downloadReport === 1) {
      this.downloadPDF();
    }*/

        // 动态计算容器的宽度，确保其为浏览器宽度的 60%
        this.$message('报告渲染中...');
        this.$nextTick(() => {
            this.getReportData();
            // 使用 ref 来动态获取容器的宽度
            /*if (this.$refs.graphContainer) {
        this.containerWidth = this.$refs.graphContainer.offsetWidth;
        this.containerHeight = 300; // 固定高度
        window.addEventListener('resize', this.updateContainerWidth);
      }*/
            setTimeout(() => {
                this.viewReport();
            }, 2000);
        });
    },
    destroyed() {
        // window.removeEventListener('resize', this.updateContainerWidth);
    },
    methods: {
        //
        downloadPDF() {
            let uploadUrl = '/aiReport/api/upload';
            this.$message('报告下载中，请稍后！');
            this.$nextTick(() => {
                htmlToPdf.downloadPDF(
                    '.page-container',
                    this.baseInfo.analysisName + '_教师版',
                    uploadUrl,
                    this.analysisId,
                    this.analysisType
                );
            });
        },

        viewReport() {
            const router = this.$route.query;
            console.log('router.downloadReport: ', router.downloadReport);
            if (router.downloadReport === '1') {
                console.log('下载新版报告...');
                // const integralAnalysisDom = this.$refs.integralAnalysis;
                // this.chart = echarts.init(integralAnalysisDom);
                // // 监听图表渲染完成
                // this.chart.on('finished', () => {
                //   console.log('图表渲染完成');
                //   // 生成 PDF
                this.downloadPDF();
                // });
            }
        },
        // 获取分析池总计数据
        async getReportData() {
            try {
                const res = await this.$axios.get('/aiReport/nubiAnalysisData', {analysisId: this.analysisId});
                if (res.code == 200) {
                    this.$nextTick(() => {
                        this.baseInfo = res.data?.baseInfo;
                        this.integralAnalysis.summaryText = res.data?.summary?.integralAnalysis?.summaryText;
                        this.integralAnalysis.fiasSummaryText = res.data?.summary?.integralAnalysis?.fiasSummaryText;
                        this.integralAnalysis.ireSummaryText = res.data?.summary?.integralAnalysis?.ireSummaryText;
                        this.integralAnalysis.facilitationSummaryText =
                            res.data?.summary?.integralAnalysis?.facilitationSummaryText;
                        // this.periodAnalysis.summaryText = "在教学效果方面，" + res.data?.summary?.periodAnalysis?.summaryText;

                        this.periodAnalysis = res.data?.summary?.periodAnalysis;
                        this.initPeriods(this.periodAnalysis.periods);
                        this.teacherTeachAnalysis = res.data?.summary?.teachingAnalysis?.teacherTeachAnalysis;
                        // this.teacherTeachAnalysis.summaryText =
                        //     res.data?.summary?.teachingAnalysis?.teacherTeachAnalysis?.summaryText
                        //         .replace("class=\"highlight-y\"", "style=\"background-color: #fff0de\"");
                        this.studentAnalysis = res.data?.summary?.teachingAnalysis?.studentAnalysis;
                        // this.studentAnalysis.summaryText =
                        //     res.data?.summary?.teachingAnalysis?.studentAnalysis?.summaryText
                        //         .replace();
                        this.knowledgeAssociation = res.data?.teacher?.knowledgeAssociation;
                        this.inspireCreativity = res.data?.teacher?.inspireCreativity;
                        this.enlighten = res.data?.teacher?.inspireCreativity?.enlighten;
                        this.teacherThought = res.data?.teacher?.teacherThought;

                        this.clazzDistributionChart =
                            res.data?.teacher?.inspireCreativity?.fourHo?.clazzDistributionChart;
                        this.qaDistributionChart = res.data?.teacher?.inspireCreativity?.fourHo?.qaDistributionChart;
                        this.stInteraction = res.data?.teacher?.inspireCreativity?.stInteraction;
                        this.timeDistributed = res.data?.teacher?.inspireCreativity?.timeDistributed;

                        this.facilitationMethod = res.data?.teacher?.teacherThought?.facilitationMethod;
                        this.kaVo = res.data.teacher?.teacherThought?.kaVo;

                        this.studentKa = res.data?.student?.studentKa;
                        this.studentFias = res.data?.student?.studentFias;
                        this.studenLr = res.data?.student?.studenLr;
                        this.studentSentiment = res.data?.student?.studentSentiment;
                        if (
                            this.knowledgeAssociations !==
                            res.data?.teacher?.knowledgeAssociation?.knowledgeAssociations
                        ) {
                            this.knowledgeAssociations = res.data?.teacher?.knowledgeAssociation?.knowledgeAssociations;
                            this.initKnowledgeAssociations(this.knowledgeAssociations);
                        }

                        if (this.totalGraph !== res.data?.teacher?.languageOriented) {
                            this.languageOriented = res.data?.teacher?.languageOriented;
                        }

                        if (this.totalGraph !== res.data?.teacher?.knowledgeAssociation?.graph?.totalGraph) {
                            this.totalGraph = res.data?.teacher?.knowledgeAssociation?.graph?.totalGraph;
                        }
                        if (this.graphs !== res.data?.teacher?.knowledgeAssociation?.graph?.graphs) {
                            this.graphs = res.data.teacher?.knowledgeAssociation?.graph?.graphs;
                        }
                        this.idre = res.data.teacher.inspireCreativity.idre;
                        // this.initIntegralAnalysisText();
                        this.initIntegralAnalysis(res.data.summary.integralAnalysis);
                        this.initCharacteristicsAnalysis(res.data.summary.characteristicsAnalysis);
                        // this.initIdre(res.data.teacher.inspireCreativity.idre);
                    });
                    console.log('this.graphs: ', this.graphs);
                    console.log('this.languageOriented: ', this.languageOriented);
                    console.log('this.totalGraph: ', this.totalGraph);

                    // console.log("this.enlighten: ", this.enlighten);
                } else {
                    console.error('Error fetching report data:', res.message);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        },
        insertSummaryText(integralAnalysisText) {
            const summaryContentDiv = document.getElementById('integralAnalysisText');
            if (summaryContentDiv) {
                summaryContentDiv.innerHTML = integralAnalysisText;
            }
        },
        initIntegralAnalysisText() {
            let integralAnalysisText = '';
            if (this.integralAnalysis?.summaryText.length > 0) {
                integralAnalysisText.concat(
                    this.integralAnalysis?.summaryText.replace('class="highlight-g"', 'style="color: #e6ecff"')
                );
            }
            if (this.periodAnalysis?.summaryText.length > 0) {
                integralAnalysisText.concat(
                    this.integralAnalysis?.summaryText.replace('class="highlight-y"', 'style="color: #fff0de"')
                );
            }
            this.integralAnalysisText = integralAnalysisText;
            console.log('课堂概要说明：', integralAnalysisText);
        },
        // 初始化课堂概-课堂整体表现
        initIntegralAnalysis(integralAnalysis) {
            this.intergralAnalysisOption.series[0].data[0].value = integralAnalysis.referene;
            this.intergralAnalysisOption.series[0].data[1].value = integralAnalysis.value;
            const chartDom = document.getElementById('integralAnalysis');
            const myChart = echarts.init(chartDom);
            this.intergralAnalysisOption && myChart.setOption(this.intergralAnalysisOption);
        },
        // 教学效果序列分析拆分列表
        initPeriods(periods) {
            if (periods.length < 1) {
                return;
            }
            const chunkSize = 4;
            const chunks = [];

            for (let i = 0; i < periods.length; i += chunkSize) {
                chunks.push(periods.slice(i, i + chunkSize));
            }

            this.periodAnalysis.chunkedPeriods = chunks;
            console.log('this.periodAnalysis.chunkedPeriods: ', this.periodAnalysis.chunkedPeriods);
        },
        initKnowledgeAssociations(knowledgeAssociations) {
            if (knowledgeAssociations.length < 1) {
                return;
            }
            const chunkSize = 4;
            const chunks = [];

            for (let i = 0; i < knowledgeAssociations.length; i += chunkSize) {
                chunks.push(knowledgeAssociations.slice(i, i + chunkSize));
            }

            this.chunkKnowledgeAssociations = chunks;
            console.log('this.chunkKnowledgeAssociations: ', this.chunkKnowledgeAssociations);
        },
        // 初始化课堂特点
        initCharacteristicsAnalysis(characteristicsAnalysis) {
            // console.log("课堂特点 characteristicsAnalysis: ", characteristicsAnalysis)
            this.classroomFeatures[0].rating = characteristicsAnalysis.student4matDiversity;
            this.classroomFeatures[1].rating = characteristicsAnalysis.idreSimple;
            this.classroomFeatures[2].rating = characteristicsAnalysis.idreDiscussion;
            this.classroomFeatures[3].rating = characteristicsAnalysis.idreRepeat;
            this.classroomFeatures[4].rating = characteristicsAnalysis.teacherSpeech;
            this.classroomFeatures[5].rating = characteristicsAnalysis.teacherPromoteEffectiveLearning;
            this.classroomFeatures[6].rating = characteristicsAnalysis.studentExpression;
            this.classroomFeatures[7].rating = characteristicsAnalysis.clazzImagination;
            this.classroomFeatures[8].rating = characteristicsAnalysis.clazzInteraction;
            this.classroomFeatures[9].rating = characteristicsAnalysis.motivateStudent;
            this.classroomFeatures[10].rating = characteristicsAnalysis.clazzKaBalance;
        },
        // 第二部分教师分析 （一）语言的正面导向-知识图谱
        updateContainerWidth() {
            // 使用 this.$refs 获取容器的宽度
            if (this.$refs.graphContainer) {
                this.containerWidth = this.$refs.graphContainer.offsetWidth;
            }
        },
        getGraphBubbleStyle(item) {
            // 基于权重计算圆圈大小
            const size = Math.max(item.weight * 2, 50); // 确保圆圈最小为50px
            const radius = size / 2;

            // 获取不重叠的位置
            const position = this.generateUniquePosition(radius, size);

            // 记录圆圈位置
            this.positions.push(position);

            return {
                backgroundColor: this.getRandomColor(),
                width: size + 'px',
                height: size + 'px',
                borderRadius: '50%',
                position: 'absolute', // 确保气泡位置相对于容器
                top: position.top + 'px',
                left: position.left + 'px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            };
        },
        generateUniquePosition(size) {
            const maxAttempts = 100; // 最大尝试次数
            const minDistance = 20; // 最小距离，防止重叠
            let attempt = 0;
            let position = null;

            // 将圆圈的半径转化为数字
            const radius = parseInt(size) / 2;

            while (attempt < maxAttempts) {
                // 随机生成位置
                const top = Math.random() * (600 - radius * 2) + radius;
                const left = Math.random() * (600 - radius * 2) + radius;

                // 检查与已有位置的最小距离
                let overlap = false;
                for (const pos of this.positions) {
                    // 假设pos.size是之前元素的size，如果没有，您需要记录每个位置对应的大小或半径
                    const otherRadius = parseInt(pos.size) / 2;
                    const dist = Math.sqrt(Math.pow(pos.top - top, 2) + Math.pow(pos.left - left, 2));
                    // 确保dist大于等于两个圆半径之和加上最小距离
                    if (dist < radius + otherRadius + minDistance) {
                        overlap = true;
                        break;
                    }
                }

                // 如果没有重叠，返回这个位置
                if (!overlap) {
                    position = {top, left, size}; // 记录位置以及其对应的大小
                    break;
                }

                attempt++;
            }

            // 如果尝试次数超限，默认位置
            if (!position) {
                position = {top: radius, left: radius, size};
            }

            return position;
        },
        getRandomColor() {
            // 随机生成一个颜色
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        getGraphTextStyle(item) {
            // 根据圆圈大小调整文字字体大小
            const size = Math.max(item.weight * 6, 50); // 确保圆圈最小为50px
            return {
                fontSize: `${size * 0.2}px`, // 文字大小根据圆圈大小调整
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                lineHeight: `${size}px`, // 确保文字居中
                padding: '0 5px', // 防止文字被裁剪
            };
        },
    },
};
</script>

<style scoped>
/* ::v-deep  */
/* 设置整个报告容器 */
.report-container {
    width: 60vw; /* 宽度占浏览器的60% */
    max-width: 794px; /* A4 宽度的最大限制（300 DPI下） 2480  826 */
    height: 16997px; /* 19253 17页  */
    box-sizing: border-box;
    position: relative;
    overflow: hidden; /* 防止内容溢出 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 可选：页面阴影 */
    display: block;
    margin: 10px auto 0;
    /*  transform-origin: top left;
    transform: scale(1); !* 等比例缩放 *!*/
}

/* 确保每一页容器符合 A4 页面尺寸 */
.page-container {
    width: 100%; /* 使用父容器宽度 */
    overflow: hidden;
    position: relative; /* 确保页码可以相对于这个容器定位 */
    margin-bottom: 40px; /* 确保页码有足够的空间 */
    height: auto;
    height: 1123px; /* A4 高度（300 DPI）3508 1169 */
    background-color: #f1f2f4;
    background-color: white;
    page-break-before: always; /* 确保每一页从新的一页开始 */
    padding: 20px;
    box-sizing: border-box;
    display: block;
    margin-bottom: 10px;
}

/* 响应式调整，适应不同分辨率 */
@media (max-width: 1200px) {
    .report-container {
        width: 70vw; /* 更小的屏幕时调整为 70% 宽度 */
    }
}

@media (max-width: 900px) {
    .report-container {
        width: 80vw; /* 进一步缩小 */
    }
}

header,
main,
footer {
    width: 100%;
}

header {
    text-align: center;
}

header img {
    max-width: 100%;
    height: auto;
}

h1,
h2,
p {
    margin: 10px 0;
}

footer {
    text-align: right;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border: 1px solid #d7d7d7;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 16px;
    text-align: center;
}

.data-table th {
    background-color: #f5f5f5;
}

.summary-section {
    margin-top: 20px;
}

.graph-container {
    position: relative;
    width: 100%;
    height: 240px;
    border: 1px solid #efe8e3;
    margin-top: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.graph {
    width: 100%;
    height: 80%;
}

.graph-item {
    display: flex;
    float: left;
    flex-direction: column;
    width: 50%;
    align-items: center; /* 水平居中 */
    margin-bottom: 20px; /* 可选：增加每个 graph 之间的间距 */
}

.graph-img {
    float: left;
    width: calc(50% - 40px);
    width: calc(100% - 50px); /* 图片宽度占满容器 */
    height: calc(50% - 2px);
    height: auto; /* 高度自动调整 */
    border: 1px solid #efe8e3;
    margin-left: 25px;
}

.graph-time {
    margin-top: 10px; /* 设置上边距 */
    text-align: center; /* 确保文本居中 */
}

.graph-text span {
    width: 160px;
    margin: 0 auto;
    display: block;
}

.graph-img img {
    width: calc(88% - 2px); /* 固定宽度 */
    width: 100%; /* 固定宽度 */
    height: auto; /* 高度自动调整 */
}

.bubble {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    color: white;
    font-weight: bold;
}

.knowledge-graph-section {
    margin-top: 20px;
}

.charts-section-four {
    width: 100%;
    height: 350px;
}

.charts-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    width: 100%;
}

.charts-section-one {
    width: 50%;
    float: left;
}

.charts-section-two {
    width: 50%;
    float: left;
}

.chart-item img {
    width: 48%;
    height: auto;
}

.interaction-section {
    margin-top: 40px;
}

.curve-description {
    margin-top: 20px;
    width: 100%;
    height: 300px;
}

.curve-description ul {
    list-style-type: disc;
    padding-left: 20px;
}

.curve-description li {
    margin-bottom: 5px;
}

.curve-description > div > ul {
    list-style-type: disc;
    padding-left: 20px;
}

.data-table,
.style-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.data-table th,
.data-table td,
.style-table th,
.style-table td {
    border: 1px solid #dfe2ed;
    padding: 8px;
    text-align: left;
}

.chart-section {
    width: 100%;
}

.chart-section img {
    max-width: 100%;
    height: auto;
}

.table-section {
    margin-top: 20px;
}

.font-size-17 {
    font-size: 17px;
}

.indented-text {
    text-indent: 2em;
    font-size: 17px;
    margin-left: 0; /* 确保没有额外的左边距 */
}

.summary-text {
    margin: 0; /* 清除外边距 */
    padding: 0; /* 清除内边距 */
    text-align: left; /* 设置左对齐 */
    line-height: 1.5; /* 设置行高 */
    font-size: 16px; /* 设置字体大小 */
}

.text-indent-2em {
    text-indent: 2em;
}

.highlight-g,
.highlight-b,
.highlight-a,
.highlight-c,
.highlight-d,
.highlight-e,
.highlight-f {
    color: #f99723;
}

.highlight-y {
    color: #8f99c8;
}

.green-text-color {
    color: #74d1a1;
}

.orange-text-color {
    color: #f39d3c;
}

.font-size-10 {
    font-size: 10px;
}

.font-size-12 {
    font-size: 12px;
}

.font-size-14 {
    font-size: 14px;
}
.font-size-15 {
    font-size: 15px;
}

.font-size-16 {
    font-size: 16px;
}

.font-size-17 {
    font-size: 17px;
}

.font-size-18 {
    font-size: 18px;
}

.red-text-color {
    color: #ff0000;
}

.font-color-c6c6c6 {
    color: #999999;
}

.td-text-center {
    text-align: center;
    vertical-align: middle;
}

.left-title {
    width: 20%;
    font-size: 11px;
    margin-bottom: 10px;
    text-align: right;
    float: left;
}

.left-title-p {
    height: 21px;
    margin-top: 0;
    margin-bottom: 4px;
    line-height: 20px;
    align-items: center;
}

.right-table {
    width: 100%;
    text-align: center;
    font-size: 11px;
    float: left;
    margin-bottom: 10px;
}

.right-table td,
th {
    vertical-align: middle;
}

.right-table-tr {
    height: 20px;
    border-right: 2px solid #ddd;
}

.right-table-tr-border-right {
    border-right: 2px solid #ddd;
}

.right-table-left-td {
    text-align: right;
    width: 335px;
    min-width: 152px;
    border: none;
    padding-right: 3px;
}
.sticky-column {
    position: sticky;
    left: 0;
}
.right-table-left-td1 {
    text-align: right;
    min-width: 118px;
    border: none;
    padding-right: 3px;
}

.right-table-td-green {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #e2fdf2;
    color: #00c064;
}

.right-table-td-orange {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #fff2de;
    color: #f38000;
}

.right-table-td-purple {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #f1f1ff;
    color: #465abb;
}

.category-labels {
    float: left;
    width: 100%;
    height: 40px;
    margin-top: 20px;
}

.diamonds-green {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #41c887;
    margin-right: 5px;
    float: left;
}

.diamonds-green-text {
    color: #74d1a2;
    float: left;
}

.diamonds-orange {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #f99723;
    margin-right: 5px;
    float: left;
    margin-left: 30px;
}
.diamonds-orange-text {
    color: #f39d3d;
    float: left;
}

.diamonds-purple {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #8f99c8;
    margin-right: 5px;
    float: left;
    margin-left: 30px;
}

.diamonds-purple-text {
    color: #a6add0;
    float: left;
}

.timeline {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
}

.timeline span {
    color: #7c7c7c;
}

.green {
    color: #5cb85c;
}

.orange {
    color: #f0ad4e;
}

.line-height {
    line-height: 1.5;
}

.font-weight {
    font-weight: bold;
}

.annotation-section p {
    font-size: 16px;
    line-height: 1.5;
}

.learning-style-section p {
    font-size: 18px;
    line-height: 1.5;
}

.margin-bottom-30 {
    margin-bottom: 30px;
}

.margin-top-30 {
    margin-top: 30px;
}

.margin-top-40 {
    margin-top: 30px;
}

.margin-top-60 {
    margin-top: 60px;
}

.margin-top-90 {
    margin-top: 90px;
}

.text-align {
    text-align: center;
}
/* 角标样式 */
.superscript {
    font-size: 10px; /* 设置比段落文字小的字体 */
    vertical-align: super; /* 文字上浮 */
    position: absolute; /* 绝对定位 */
    top: 0; /* 调整向上偏移量 */
    left: 0; /* 水平位置 */
    background-color: #fff; /* 可选：背景色 */
    padding: 2px; /* 可选：内边距 */
    border-radius: 3px; /* 可选：圆角 */
}
.interaction-data {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: flex-start; /* 垂直对齐方式，可以根据需要调整 */
    gap: 20px; /* 设置子元素之间的间距 */
    background-color: #fdf6ed;
    border-radius: 10px;
    font-size: 16px;
}

.left-section {
    margin-left: 80px;
    margin-top: 10px;
    float: left;
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.right-section {
    margin-left: 80px;
    margin-top: 10px;
    float: left;
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.chart-section-data {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: flex-start; /* 垂直对齐方式，可以根据需要调整 */
    gap: 20px; /* 设置子元素之间的间距 */
    width: 100%;
    margin-top: 20px;
}

.chart-section-right {
    float: left;
    flex: 1;
    box-sizing: border-box;
}

.chart-section-left {
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.text-align-left {
    text-align: left;
}

.text-align-center {
    text-align: center;
}

.info-item {
    margin: 15px 0;
    font-size: 18px;
}

.label {
}

.value {
    color: #f5aa56;
    font-weight: bold;
}

.scatter-plot-section {
}

.ire-analysis-section ul li {
    line-height: 1.5;
    font-size: 17px;
    margin-bottom: 5px;
}

.brain-stimulation-top {
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    height: 100px;
    background-color: #fdf6ed;
    display: flex;
    justify-content: center; /* 水平居中 */
    padding-top: 5px;
    border-radius: 10px;
}

.emotion-data {
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    height: 60px;
    background-color: #fdf6ed;
    border-radius: 10px;
    display: flex;
    justify-content: center; /* 水平居中 */
    padding-top: 20px;
}

.footer {
    position: absolute; /* 绝对定位 */
    bottom: 0; /* 底部对齐 */
    left: 0;
    right: 0;
    display: flex; /* 使用 Flexbox */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 40px; /* 页码的高度 */
}

.page-number {
    font-size: 16px; /* 字体大小 */
    color: #333; /* 字体颜色 */
}

.footer-version {
    position: absolute; /* 绝对定位 */
    bottom: 10px; /* 距离底部的边距 */
    right: 10px; /* 距离右边的边距 */
    padding: 5px 10px; /* 内边距 */
    border-radius: 5px; /* 圆角 */
}

.footer-version p {
    margin: 0; /* 去除默认的段落间距 */
    font-size: 14px; /* 字体大小 */
    color: #b0b1c8; /* 字体颜色 */
}
</style>

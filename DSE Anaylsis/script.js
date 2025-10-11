document.addEventListener('DOMContentLoaded', () => {
    const dseForm = document.getElementById('dseForm');
    const electivesContainer = document.getElementById('electives-container');
    const addElectiveBtn = document.getElementById('add-elective-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('analysis-results');

    // DSE 級別分數轉換 (Level 5** = 7, 5* = 6, 5 = 5, ...)
    const scoreMap = {
        '5**': 7, '5*': 6, '5': 5,
        '4': 4, '3': 3, '2': 2, '1': 1,
        'A': 0, 'U': 0 // 不予評級
    };

    // 可選選修科目列表
    const electiveSubjects = [
        '物理', '化學', '生物', '經濟', '企業、會計與財務概論',
        '地理', '歷史', '中國歷史', '資訊及通訊科技', '視覺藝術',
        '數學延伸部分(M1)', '數學延伸部分(M2)', '體育', '音樂',
        '倫理與宗教', '旅遊與款待', '設計與應用科技', '家政與生活技能'
    ];

    // 2024 年 DSE 最佳五科累積百分位數據 (簡化)
    const percentileData = [
        { score: 35, percentile: 99.5, rank: '頂尖 0.5%', desc: '極頂尖成績' },
        { score: 28, percentile: 90, rank: '約 Top 10%', desc: '穩入港大/中大高競爭力學科' },
        { score: 23, percentile: 75, rank: '約 Top 25%', desc: '高於四分位數，有望入讀熱門學士課程' },
        { score: 20, percentile: 60, rank: '約 Top 40%', desc: '穩入八大資助學士學位課程' },
        { score: 14, percentile: 45, rank: '約 Top 55%', desc: '達到學士最低要求' },
        { score: 10, percentile: 30, rank: '約 Top 70%', desc: '達到高級文憑/副學士基礎要求' },
        { score: 5, percentile: 10, rank: '約 Top 90% 以下', desc: '建議考慮其他進修途徑' }
    ];

    // 選修科目計數器

    let electiveCount = 0;
    addElectiveBtn.addEventListener('click', () => {
        if (electiveCount >= 6) {
            alert('最多只能添加 6 科選修科目');
            return;
        }
        electiveCount++;
        const electiveDiv = document.createElement('div');
        electiveDiv.classList.add('input-group');
        electiveDiv.innerHTML = `
            <label for="elective-${electiveCount}">選修科目 ${electiveCount}：</label>
            <select id="elective-${electiveCount}" name="elective-${electiveCount}" required>
                <option value="">請選擇科目</option>
                ${electiveSubjects.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
            </select>
            <select id="grade-${electiveCount}" name="grade-${electiveCount}" required>
                <option value="">請選擇成績</option>
                <option value="5**">5**</option>
                <option value="5*">5*</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
                <option value="U">U (不予評級)</option>
            </select>
            <button type="button" class="remove-elective-btn">移除</button>
        `;
        electivesContainer.appendChild(electiveDiv);
        electiveDiv.querySelector('.remove-elective-btn').addEventListener('click', () => {
            electivesContainer.removeChild(electiveDiv);
            electiveCount--;
        });
    });
        // ... (scoreMap 和 percentileData 保持不變) ...

// ... (省略 addElectiveBtn 邏輯) ...
    // 根據分數計算排名和百分位
    function getRankAndPercentile(bestFiveTotal) {
        for (const data of percentileData) {
            if (bestFiveTotal >= data.score) {
                return { rankText: data.rank, percentileText: `約 ${data.percentile} 百分位 (${data.desc})` };
            }
        }
        return { rankText: '未達標', percentileText: '低於 10 百分位' };
    }

    /**
     * 函式：提交表單並進行分析
     */
    dseForm.addEventListener('submit', (e) => {
        dseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 收集核心科目成績
            const coreGrades = {
                chi: document.getElementById('chi').value,
                eng: document.getElementById('eng').value,
                math: document.getElementById('math').value,
                csd: document.getElementById('csd').value
            };

            // 收集選修科目成績
            const electiveGrades = [];
            for (let i = 1; i <= electiveCount; i++) {
                const subject = document.getElementById(`elective-${i}`)?.value;
                const grade = document.getElementById(`grade-${i}`)?.value;
                if (subject && grade) {
                    electiveGrades.push({ subject, grade });
                }
            }

            // 合併所有分數（只取中、英、數，不計 CSD）
            const allScores = [
                scoreMap[coreGrades.chi] || 0,
                scoreMap[coreGrades.eng] || 0,
                scoreMap[coreGrades.math] || 0,
                ...electiveGrades.map(e => scoreMap[e.grade] || 0)
            ];
            // 排序並取最佳五科
            const sortedScores = allScores.slice().sort((a, b) => b - a);
            const bestFiveScores = sortedScores.slice(0, 5);
            const bestFiveTotal = bestFiveScores.reduce((sum, score) => sum + score, 0);

            // 分析排名和百分位
            const { rankText, percentileText } = getRankAndPercentile(bestFiveTotal);

            // 高級文憑 (HD) / 副學士 (AD) 入學基礎要求：中、英 2 級，及任何其他 3 科 2 級
            const chiPass = scoreMap[coreGrades.chi] >= 2;
            const engPass = scoreMap[coreGrades.eng] >= 2;
            const level2Count = bestFiveScores.filter(score => score >= 2).length;
            const cslAttained = (coreGrades.csd === 'A');
            const isHDQualified = chiPass && engPass && level2Count >= 5;

            // 顯示結果
            document.getElementById('result-best5').textContent = bestFiveTotal;
            document.getElementById('result-rank').textContent = rankText;
            document.getElementById('result-percentile').textContent = percentileText;
            let hdResultText = isHDQualified ?
                `✓ 達到基礎要求 (五科 2 級)` :
                `X 未達到基礎要求 (需五科 2 級)`;
            hdResultText += cslAttained ? ` | 公民科：達標` : ` | 公民科：不達標`;
            document.getElementById('result-hd-req').textContent = hdResultText;
            resultsSection.style.display = 'block';
        });
        let hdResultText = isHDQualified ? 
            `✓ 達到基礎要求 (五科 2 級)` : 
            `X 未達到基礎要求 (需五科 2 級)`;
            
        hdResultText += cslAttained ? ` | 公民科：達標` : ` | 公民科：不達標`;

        document.getElementById('result-hd-req').textContent = hdResultText;

        resultsSection.style.display = 'block'; // 顯示結果區
    });

// ... (重新輸入按鈕邏輯保持不變) …

    resetBtn.addEventListener('click', () => {
        dseForm.reset();
        electivesContainer.innerHTML = '';
        electiveCount = 0;
        resultsSection.style.display = 'none';
        document.getElementById('result-best5').textContent = '';
        document.getElementById('result-rank').textContent = '';
        document.getElementById('result-percentile').textContent = '';
        document.getElementById('result-hd-req').textContent = '';
    });
});
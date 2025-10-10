document.addEventListener('DOMContentLoaded', () => {
    const dseForm = document.getElementById('dseForm');
    const electivesContainer = document.getElementById('electives-container');
    const addElectiveBtn = document.getElementById('add-elective-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('analysis-results');

    // DSE 級別分數轉換 (Level 5** = 7, 5* = 6, 5 = 5, ...)
    const scoreMap = {
        '5**': 7,
        '5*': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2,
        '1': 1,
        'U': 0, // 不予評級
    };

    // 2024 年 DSE 最佳五科累積百分位數據 (概念性/簡化參考)
    // 根據考評局數據，結合學友社等資訊簡化歸納。
    // 實際百分位計算需要更精確的數據分佈表。
    // 數據來源：基於 2024 DSE 統計，約 18,392 人達 332A+22 (約 37.5%)。
    const percentileData = [
        { score: 35, percentile: 99.5, rank: '頂尖 0.5%', desc: '極頂尖成績' },
        { score: 28, percentile: 90, rank: '約 Top 10%', desc: '穩入港大/中大高競爭力學科' },
        { score: 23, percentile: 75, rank: '約 Top 25%', desc: '高於四分位數，有望入讀熱門學士課程' },
        { score: 20, percentile: 60, rank: '約 Top 40%', desc: '穩入八大資助學士學位課程 (學友社基準)' },
        { score: 14, percentile: 45, rank: '約 Top 55%', desc: '達到學士最低要求 (332A+22) 邊緣' },
        { score: 10, percentile: 30, rank: '約 Top 70%', desc: '達到高級文憑/副學士基礎要求' },
        { score: 5, percentile: 10, rank: '約 Top 90% 以下', desc: '建議考慮其他進修途徑' }
    ];

    let electiveCount = 0;

    // --- (新增選修科目的邏輯請保留，如前所述) ---
    addElectiveBtn.addEventListener('click', () => {
        // ... (scoreMap 和 percentileData 保持不變) ...

// ... (省略 addElectiveBtn 邏輯) ...
});

    /**
     * 函式：提交表單並進行分析
     */
    dseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. 收集所有成績
        const coreGrades = {
            chi: document.getElementById('chi').value,
            eng: document.getElementById('eng').value,
            mat: document.getElementById('mat').value,
            csl: document.getElementById('csl').value, // CSL now is 'A' (達標) or 'U' (不達標)
        };
        
        // ... (省略 electiveGrades 收集) ...

        // 2. 轉換為分數並計算 Best 5
        let allScores = [];
        
        // 核心科目分數 (公民科不計分，但我們需要將其排除在 Best 5 之外)
        for (const key of ['chi', 'eng', 'mat']) {
            const grade = coreGrades[key];
            const score = scoreMap[grade] || 0;
            allScores.push(score);
        }

        // ... (省略選修科目分數計算) ...

        // 計算最佳五科總成績 (Best 5)
        // ... (保持不變) ...
        const bestFiveTotal = bestFiveScores.reduce((sum, score) => sum + score, 0);


        // 3. 分析排名和百分位 (基於 2024 年數據)
        // ... (保持不變，依據 bestFiveTotal 查找排名) ...


        // 4. 分析是否達到高級文憑要求 (HD Req.)
        // 基礎要求：五科達 2 級 (包括中、英)
        let isHDQualified = false;
        
        // 檢查中、英是否達到 2 級
        const chiPass = scoreMap[coreGrades.chi] >= 2;
        const engPass = scoreMap[coreGrades.eng] >= 2;
        
        // 檢查 Best 5 中是否至少有 5 科達到 2 級
        const level2Count = sortedScores.filter(score => score >= 2).length;
        
        // CSL 檢查
        const cslAttained = (coreGrades.csl === 'A');

        // 高級文憑 (HD) / 副學士 (AD) 入學基礎要求：中、英 2 級，及任何其他 3 科 2 級
        // CSL 是否達標不是強制要求，但仍是入學評估的一部分。
        if (chiPass && engPass && level2Count >= 5) {
            isHDQualified = true;
        }

        // 5. 顯示結果
        document.getElementById('result-best5').textContent = bestFiveTotal;
        document.getElementById('result-rank').textContent = rankText;
        document.getElementById('result-percentile').textContent = percentileText;
        
        // HD 結果顯示時，特別提到 CSL 狀態
        let hdResultText = isHDQualified ? 
            `✓ 達到基礎要求 (五科 2 級)` : 
            `X 未達到基礎要求 (需五科 2 級)`;
            
        hdResultText += cslAttained ? ` | 公民科：達標` : ` | 公民科：不達標`;

        document.getElementById('result-hd-req').textContent = hdResultText;

        resultsSection.style.display = 'block'; // 顯示結果區
    });

// ... (重新輸入按鈕邏輯保持不變) …

    resetBtn.addEventListener('click', () => {
        window.location.reload(); 
    });
});
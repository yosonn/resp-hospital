document.addEventListener("DOMContentLoaded", function() {
    // 根據頁面元素 ID 判斷當前在哪一頁，並執行對應初始化
    
    // 1. 病患詳細頁 (Patient Detail)
    if (document.getElementById('hrChart')) {
        initPatientCharts();
        initAiSuggestion(); // 初始化 AI 建議
    }

    // 2. 租借管理頁 (Rental)
    if (document.getElementById('rentalTableBody')) {
        initRentalSystem();
    }

    // 3. BI 分析頁 (BI Dashboard)
    if (document.getElementById('riskTrendChart')) {
        initBiDashboard();
    }
});

/* =========================================
   1. 病患詳細頁邏輯
   ========================================= */
function initAiSuggestion() {
    const aiContent = document.getElementById('aiContent');
    if (!aiContent) return;

    // 模擬後端回傳的 AI 建議資料
    const mockAiResponse = {
        status: "warning",
        suggestions: [
            "SpO₂ 過去 1 小時平均 89%，<span class='ai-highlight'>建議檢查氧氣流量</span>或管路是否脫落。",
            "RR 呼吸頻率呈上升趨勢 (26 bpm)，建議評估是否需要<span class='ai-highlight'>調整呼吸器支持壓力</span>。",
            "EtCO₂ 數值穩定，持續監測即可。"
        ]
    };

    let html = `<ul style="padding-left: 20px; margin-top: 5px;">`;
    mockAiResponse.suggestions.forEach(s => {
        html += `<li style="margin-bottom: 5px;">${s}</li>`;
    });
    html += `</ul>`;
    
    aiContent.innerHTML = html;
}

function initPatientCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false }, ticks: { color: '#999' } },
            y: { grid: { borderDash: [5, 5], color: '#eee' }, ticks: { color: '#999' } }
        },
        plugins: { legend: { display: false } },
        elements: { point: { radius: 0, hitRadius: 10 }, line: { tension: 0.4 } }
    };

    const labels = generateTimeLabels(30);

    // HR Chart
    new Chart(document.getElementById('hrChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: generateRandomData(30, 85, 100),
                borderColor: '#ef5350',
                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                fill: true
            }]
        },
        options: commonOptions
    });

    // SpO2 Chart
    new Chart(document.getElementById('spo2Chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: generateRandomData(30, 88, 94),
                borderColor: '#039be5',
                backgroundColor: 'rgba(3, 155, 229, 0.1)',
                fill: true
            }]
        },
        options: { ...commonOptions, scales: { ...commonOptions.scales, y: { min: 80, max: 100 } } }
    });

    // RR Chart
    new Chart(document.getElementById('rrChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: generateRandomData(30, 18, 28),
                borderColor: '#43a047',
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                fill: true
            }]
        },
        options: commonOptions
    });
}

/* =========================================
   2. 租借管理頁邏輯
   ========================================= */
function initRentalSystem() {
    const tableBody = document.getElementById('rentalTableBody');
    const searchInput = document.getElementById('rentalSearch');

    // 假資料 (Mock Data)
    const rentals = [
        { patient: "吳宥辰", ward: "5A-12", device: "PB840 呼吸器", id: "V-2023001", start: "2023-10-01", duration: "長期", status: "使用中" },
        { patient: "林小美", ward: "5A-13", device: "Airvo 2", id: "H-2023045", start: "2023-10-05", duration: "7天", status: "使用中" },
        { patient: "陳大明", ward: "5B-01", device: "Philips V60", id: "B-2023012", start: "2023-09-28", duration: "3天", status: "已歸還" },
        { patient: "張志豪", ward: "5B-02", device: "咳痰機", id: "C-2023088", start: "2023-10-06", duration: "1天", status: "維修中" },
        { patient: "劉恩希", ward: "5C-08", device: "生理監視器", id: "M-2023102", start: "2023-10-02", duration: "長期", status: "使用中" },
    ];

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            let statusClass = 'badge-blue';
            if (item.status === '已歸還') statusClass = 'badge-green';
            if (item.status === '維修中') statusClass = 'badge-red';

            const row = `
                <tr>
                    <td>
                        <div style="font-weight:bold;">${item.patient}</div>
                        <div style="font-size:0.8rem; color:#666;">${item.ward}</div>
                    </td>
                    <td>
                        <div>${item.device}</div>
                        <div style="font-size:0.8rem; color:#666;">ID: ${item.id}</div>
                    </td>
                    <td>${item.start}</td>
                    <td>${item.duration}</td>
                    <td><span class="badge ${statusClass}">${item.status}</span></td>
                    <td><button class="btn-outline" style="font-size:0.8rem; padding:2px 8px;">管理</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // 初始渲染
    renderTable(rentals);

    // 搜尋功能
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = rentals.filter(item => 
            item.patient.includes(term) || 
            item.device.toLowerCase().includes(term) ||
            item.id.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
}

/* =========================================
   3. BI 分析頁邏輯
   ========================================= */
function initBiDashboard() {
    // 共用設定
    const commonBiOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // A. 整體 SpO2 風險趨勢 (Line/Area Chart)
    new Chart(document.getElementById('riskTrendChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: generateTimeLabels(12), // 過去 12 小時
            datasets: [{
                label: '高風險病患數',
                data: [1, 1, 2, 3, 2, 1, 1, 4, 5, 3, 2, 2],
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: commonBiOptions
    });

    // B. 各病房風險指標比較 (Radar Chart)
    new Chart(document.getElementById('wardRadarChart').getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['SpO2 異常率', '呼吸器警報', '設備使用率', '護理負荷', '急救次數'],
            datasets: [
                {
                    label: '5A ICU',
                    data: [80, 65, 90, 85, 40],
                    borderColor: '#0056b3',
                    backgroundColor: 'rgba(0, 86, 179, 0.2)',
                },
                {
                    label: '5B RCW',
                    data: [40, 30, 50, 40, 10],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                }
            ]
        },
        options: {
            ...commonBiOptions,
            scales: { r: { suggestMin: 0, suggestMax: 100 } }
        }
    });

    // C. RR 與 EtCO2 散佈圖 (Scatter Chart)
    // 模擬 20 個病人的數據點
    const scatterData = Array.from({length: 20}, () => ({
        x: Math.floor(Math.random() * 20) + 10, // RR: 10-30
        y: Math.floor(Math.random() * 20) + 25  // EtCO2: 25-45
    }));

    new Chart(document.getElementById('scatterChart').getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: '病患分佈 (X: RR, Y: EtCO2)',
                data: scatterData,
                backgroundColor: '#ffc107'
            }]
        },
        options: {
            ...commonBiOptions,
            scales: {
                x: { title: { display: true, text: 'RR (呼吸率)' } },
                y: { title: { display: true, text: 'EtCO2 (二氧化碳)' } }
            }
        }
    });
}

/* =========================================
   Utility Functions
   ========================================= */
function generateRandomData(count, min, max) {
    return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateTimeLabels(count) {
    return Array.from({length: count}, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (count - i));
        return d.getHours() + ':00';
    });
}

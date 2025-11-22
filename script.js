document.addEventListener("DOMContentLoaded", function() {
    // 僅在 patient.html 頁面執行圖表初始化
    if (document.getElementById('hrChart')) {
        initCharts();
    }
});

function initCharts() {
    // Chart.js 共同設定
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#999' }
            },
            y: {
                grid: { borderDash: [5, 5], color: '#eee' },
                ticks: { color: '#999' }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        elements: {
            point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
            line: { tension: 0.4 } // 曲線平滑度
        }
    };

    // 生成假時間軸 (最近 30 個時間點)
    const labels = Array.from({length: 30}, (_, i) => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - (30 - i));
        return d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0');
    });

    // --- 1. 心率圖表 (Heart Rate) ---
    const ctxHR = document.getElementById('hrChart').getContext('2d');
    const dataHR = generateRandomData(30, 85, 100); // 模擬 HR 85-100
    
    new Chart(ctxHR, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Heart Rate (bpm)',
                data: dataHR,
                borderColor: '#ef5350', // 紅色系
                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });

    // --- 2. 血氧圖表 (SpO2) ---
    const ctxSpO2 = document.getElementById('spo2Chart').getContext('2d');
    // 模擬有點危險的數據 (88-94)
    const dataSpO2 = generateRandomData(30, 88, 94); 

    new Chart(ctxSpO2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'SpO₂ (%)',
                data: dataSpO2,
                borderColor: '#039be5', // 藍色系
                backgroundColor: 'rgba(3, 155, 229, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: { min: 80, max: 100 } // 固定 Y 軸範圍
            }
        }
    });

    // --- 3. 呼吸率圖表 (RR) ---
    const ctxRR = document.getElementById('rrChart').getContext('2d');
    const dataRR = generateRandomData(30, 18, 28); // 模擬呼吸稍快 18-28

    new Chart(ctxRR, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Resp Rate (bpm)',
                data: dataRR,
                borderColor: '#43a047', // 綠色系
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });
}

// 輔助函式：生成隨機整數陣列
function generateRandomData(count, min, max) {
    return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);

}
// Sidebar Toggle for Mobile
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
});

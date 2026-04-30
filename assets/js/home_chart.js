// Expecting Chart.js to be loaded via CDN as global Chart


document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('statsChart');
    if (ctx) {
        const labelsData = ctx.dataset.chartLabels;
        const valuesData = ctx.dataset.chartData;

        if (!labelsData || !valuesData) return;

        const labels = JSON.parse(labelsData);
        const data = JSON.parse(valuesData);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doctors per Department',
                    data: data,
                    borderColor: '#92bfe7',
                    backgroundColor: 'rgba(146, 191, 231, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#92bfe7',
                    pointHoverBackgroundColor: '#92bfe7',
                    pointHoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [5, 5]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });
    }
});

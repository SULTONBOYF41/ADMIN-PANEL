// 📁 scripts/chart.js

export function renderChart(labels, data) {
  const ctx = document.getElementById("reportChart").getContext("2d");

  if (window.chartInstance) window.chartInstance.destroy();

  window.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "📊 Hisobot ma'lumotlari",
          data: data,
          backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],
          borderRadius: 6,
          barThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: { size: 14 },
            color: "#333"
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.raw.toLocaleString() + " so'm";
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString() + " so'm"
          },
          title: {
            display: true,
            text: "Miqdor (so'm)",
            font: { size: 14 }
          }
        },
        x: {
          title: {
            display: true,
            text: "Kategoriya",
            font: { size: 14 }
          }
        }
      }
    }
  });
}

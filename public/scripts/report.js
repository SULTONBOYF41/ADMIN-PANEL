// 📁 scripts/report.js
import { renderChart } from "./chart.js";
import { getParamKey, getReportParam } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initReportDropdown();
  document.getElementById("view-report-btn").addEventListener("click", viewReport);
  document.getElementById("download-pdf-btn").addEventListener("click", downloadPdfReport);
});

let reportData = null;
let selectedBranch = null;

// 🔄 Dropdown va boshqaruv elementlarini boshlash
export function initReportDropdown() {
  const producedCount = document.getElementById("produced-count");
  if (producedCount) producedCount.textContent = "umumiy";

  document.querySelectorAll('input[name="reportType"]').forEach(radio => {
    radio.addEventListener("change", updateDateInput);
  });

  updateDateInput();

  const backBtn = document.getElementById("back-to-main");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.getElementById("branch-report-container").style.display = "none";
      document.getElementById("report-summary").style.display = "flex";
      document.getElementById("report-row").style.display = "flex";
      document.getElementById("chart-title").style.display = "block";
      document.getElementById("reportChart").style.display = "block";

      if (reportData) {
        renderChart(
          ["Filial daromadi", "Buyurtmalar daromadi", "Xarajatlar", "Sof foyda"],
          [
            reportData.branch_income || 0,
            reportData.total_order_income || 0,
            reportData.total_expenses || 0,
            (reportData.branch_income + reportData.total_order_income - reportData.total_expenses)
          ]
        );
      }

      backBtn.style.display = "none";
    });
  }
}

// 📅 Sana turi bo‘yicha inputlarni boshqarish
function updateDateInput() {
  const type = document.querySelector('input[name="reportType"]:checked')?.value;
  const dateInput = document.getElementById("report-date");
  const weekInput = document.getElementById("report-week");
  const monthInput = document.getElementById("report-month");

  if (dateInput) dateInput.style.display = "none";
  if (weekInput) weekInput.style.display = "none";
  if (monthInput) monthInput.style.display = "none";

  if (type === "kunlik" && dateInput) dateInput.style.display = "inline-block";
  else if (type === "haftalik" && weekInput) weekInput.style.display = "inline-block";
  else if (type === "oylik" && monthInput) monthInput.style.display = "inline-block";
}

// 📊 Asosiy hisobotni olish
export function viewReport() {
  const type = document.querySelector('input[name="reportType"]:checked')?.value;
  const param = getReportParam(type);
  if (!param) return alert("Sana tanlanmagan!");

  const url = new URL(`http://localhost:3000/report/${type}`);
  url.searchParams.append(getParamKey(type), param);
  if (selectedBranch) url.searchParams.append("branch", selectedBranch);

  fetch(url.toString())
    .then(res => {
      if (!res.ok) throw new Error("Hisobotni olishda xatolik");
      return res.json();
    })
    .then(data => {
      reportData = data;

      const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setText("produced-count", `${data.total_production_kg} kg, ${data.total_production_dona} dona`);
      setText("sold-store", `${data.store_sold_kg} kg – ${data.store_sold_kg_price} so'm, ${data.store_sold_dona} dona – ${data.store_sold_dona_price} so'm`);
      setText("order-count", `${data.total_orders} ta – ${data.total_order_income} so'm`);
      setText("total-income", `${data.total_income} so'm`);
      setText("total-expenses", `${data.total_expenses} so'm`);
      setText("net-profit", `${data.net_profit} so'm`);

      document.getElementById("report-summary").style.display = "flex";
      document.getElementById("report-row").style.display = "flex";
      document.getElementById("chart-title").style.display = "block";
      document.getElementById("reportChart").style.display = "block";
      const branchContainer = document.getElementById("branch-report-container");
      if (branchContainer) branchContainer.style.display = "none";

      renderChart(
        ["Filial daromadi", "Buyurtmalar daromadi", "Xarajatlar", "Sof foyda"],
        [
          data.branch_income || 0,
          data.total_order_income || 0,
          data.total_expenses || 0,
          (data.branch_income + data.total_order_income - data.total_expenses)
        ]
      );

      const sources = document.getElementById("order-sources");
      if (sources) {
        sources.innerHTML = "";
        Object.entries(data.platforms || {}).forEach(([source, count]) => {
          const li = document.createElement("li");
          li.textContent = `${source}: ${count} ta`;
          sources.appendChild(li);
        });
      }

      const products = document.getElementById("top-products");
      if (products) {
        products.innerHTML = "";
        (data.top_products || []).forEach(prod => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${prod.name}</td><td>${prod.sold}</td>`;
          products.appendChild(row);
        });
      }
    })
    .catch(err => {
      console.error("❌ Hisobotda xatolik:", err.message);
      alert("Hisobotni olishda xatolik yuz berdi");
    });
}

// 📥 PDF yuklash tugmasi
export function downloadPdfReport() {
  const type = document.querySelector('input[name="reportType"]:checked').value;
  const param = getReportParam(type);
  if (!param) return alert("Sana tanlanmagan!");
  const url = `http://localhost:3000/report/pdf/${type}?${getParamKey(type)}=${encodeURIComponent(param)}`;
  window.open(url, "_blank");
}



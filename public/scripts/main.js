import { submitOrder } from "./orders.js";
import { submitExpense, loadExpenses } from "./expenses.js";
import { submitProduction, loadProduction } from "./production.js";
import { initReportDropdown, viewReport, downloadPdfReport } from "./report.js";
import { loadProducts, initProductForm } from "./products.js";


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("order-form")?.addEventListener("submit", submitOrder);
  document.getElementById("expense-form")?.addEventListener("submit", submitExpense);
  document.getElementById("production-form")?.addEventListener("submit", submitProduction);
  document.getElementById("view-report-btn")?.addEventListener("click", viewReport);
  document.getElementById("download-pdf-btn")?.addEventListener("click", downloadPdfReport);


  loadExpenses();
  loadProduction();
  loadProducts();
  initProductForm();
  initReportDropdown();
});


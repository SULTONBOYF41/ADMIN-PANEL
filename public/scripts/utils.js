// 📁 scripts/utils.js

export function getReportParam(type) {
  if (type === "kunlik") {
    return document.getElementById("report-date").value;
  }
  if (type === "haftalik") {
    return document.getElementById("report-week").value;
  }
  if (type === "oylik") {
    return document.getElementById("report-month").value;
  }
}

export function getParamKey(type) {
  if (type === "kunlik") return "date";
  if (type === "haftalik") return "week";
  if (type === "oylik") return "month";
}

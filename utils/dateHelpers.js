function getDateRange(type, value) {
  let start = new Date();
  let end = new Date();

  if (type === "kunlik") {
    const date = new Date(value);
    return {
      start: date.toISOString().slice(0, 10),
      end: date.toISOString().slice(0, 10)
    };
  }

  if (type === "haftalik") {
    // Format: 2025-W22
    const [yearStr, weekStr] = value.split("-W");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    // Haftaning birinchi kunini hisoblash (dushanba)
    const jan1 = new Date(year, 0, 1);
    const jan1Day = jan1.getDay() || 7; // Yakshanba 0 bo‘lsa, 7 bo‘ladi
    const offset = (week - 1) * 7 - (jan1Day - 1);
    start = new Date(year, 0, 1 + offset);
    end = new Date(start);
    end.setDate(end.getDate() + 6);
  }

  if (type === "oylik") {
    // Format: 2025-05
    const [year, month] = value.split("-").map(Number);
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 0);
  }

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10)
  };
}

module.exports = { getDateRange };

const express = require("express");
const router = express.Router();
const db = require("../db/database");

// to‘g‘rilangan expenses.js
router.post("/", (req, res) => {
  const { type, amount, date, note } = req.body;
  if (!type || !amount || !date) {
    return res.status(400).send("❌ Barcha majburiy maydonlar to‘ldirilishi kerak");
  }

  db.run(
    `INSERT INTO expenses (type, amount, date, note) VALUES (?, ?, ?, ?)`,
    [type, amount, date, note],
    err => {
      if (err) return res.status(500).send("❌ Saqlashda xatolik: " + err.message);
      res.send("✅ Xarajat muvaffaqiyatli qo‘shildi");
    }
  );
});

// GET /expenses - xarajatlar ro'yxatini olish
router.get("/", (_, res) => {
  db.all("SELECT * FROM expenses ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).send("❌ Xarajatlarni olishda xatolik: " + err.message);
    res.json(rows);
  });
});


module.exports = router; // 🚨 BU MUHIM QATOR

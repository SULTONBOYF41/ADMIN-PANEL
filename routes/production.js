const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.post("/", (req, res) => {
  const { name, quantity, unit, date } = req.body;

  if (!name || !quantity || !unit || !date) {
    return res.status(400).send("❌ Barcha maydonlar to‘ldirilishi shart");
  }

  const qty = parseFloat(quantity);
  const normalizedUnit = unit.toLowerCase().includes("kg") ? "kg" : "dona";

  db.get("SELECT id FROM products WHERE name = ?", [name], (err, product) => {
    if (err) return res.status(500).send("❌ Mahsulotni aniqlashda xatolik: " + err.message);
    if (!product) return res.status(404).send("❌ Bunday nomdagi mahsulot topilmadi");

    const product_id = product.id;

    db.run(
      `INSERT INTO production (name, quantity, unit, date) VALUES (?, ?, ?, ?)`,
      [name, qty, normalizedUnit, date],
      err => {
        if (err) return res.status(500).send("❌ Ishlab chiqarishni saqlashda xatolik: " + err.message);

        // 🔁 Omborda mavjud bo‘lsa yangilaymiz, bo‘lmasa qo‘shamiz
        db.get(
          `SELECT id, quantity FROM warehouse WHERE product_id = ? AND unit = ?`,
          [product_id, normalizedUnit],
          (err, row) => {
            if (err) return res.status(500).send("❌ Omborni tekshirishda xatolik: " + err.message);

            if (row) {
              const newQty = parseFloat(row.quantity) + qty;
              db.run(
                `UPDATE warehouse SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [newQty, row.id],
                err => {
                  if (err) return res.status(500).send("❌ Omborni yangilashda xatolik: " + err.message);
                  res.send("✅ Miqdor omborda yangilandi");
                }
              );
            } else {
              db.run(
                `INSERT INTO warehouse (product_id, quantity, unit) VALUES (?, ?, ?)`,
                [product_id, qty, normalizedUnit],
                err => {
                  if (err) return res.status(500).send("❌ Yangi ombor yozuvini yaratishda xatolik: " + err.message);
                  res.send("✅ Omborga yangi yozuv yaratildi");
                }
              );
            }
          }
        );
      }
    );
  });
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM production ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).send("❌ O‘qishda xatolik: " + err.message);
    res.json(rows);
  });
});

module.exports = router;

// ✅ routes/warehouse.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ✅ GET: Ombordagi barcha mahsulotlar (kg + dona bitta kartada jamlanadi)
router.get("/", (req, res) => {
  const query = `
    SELECT 
      p.id as product_id,
      p.name,
      p.category,
      p.image,
      p.price,
      p.description,
      p.unit,
      SUM(CASE WHEN w.unit = 'kg' THEN w.quantity ELSE 0 END) as kg,
      SUM(CASE WHEN w.unit = 'dona' THEN w.quantity ELSE 0 END) as dona
    FROM products p
    LEFT JOIN warehouse w ON p.id = w.product_id
    GROUP BY p.id
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error("📛 SQL xatosi:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});


router.post("/", (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || quantity == null) return res.status(400).json({ error: "Ma'lumotlar yetarli emas" });

  db.get(`SELECT id FROM warehouse WHERE product_id = ?`, [product_id], (err, row) => {
    if (err) return res.status(500).json({ error: "Tekshiruvda xatolik" });

    if (row) {
      db.run(
        `UPDATE warehouse SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
        [quantity, product_id],
        err => {
          if (err) return res.status(500).json({ error: "Yangilashda xatolik" });
          res.json({ success: true, updated: true });
        }
      );
    } else {
      db.run(
        `INSERT INTO warehouse (product_id, quantity) VALUES (?, ?)`,
        [product_id, quantity],
        err => {
          if (err) return res.status(500).json({ error: "Qo‘shishda xatolik" });
          res.json({ success: true, created: true });
        }
      );
    }
  });
});

router.delete("/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.run(`DELETE FROM warehouse WHERE product_id = ?`, [product_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json({ success: true, deleted: true });
  });
});

router.put("/:product_id", (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;
  if (quantity == null) return res.status(400).json({ error: "Yangi miqdor kerak" });

  db.run(
    `UPDATE warehouse SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
    [quantity, product_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Mahsulot topilmadi" });
      res.json({ success: true, updated: true });
    }
  );
});

module.exports = router;
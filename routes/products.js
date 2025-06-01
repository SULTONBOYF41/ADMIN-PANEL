// 📁 routes/products.js

const express = require("express");
const router = express.Router();
const db = require("../db/database");
const multer = require("multer");
const path = require("path");

// ======= RASM YUKLASH SOZLAMALARI =======
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ======= 1. Mahsulot qo‘shish (va omborga ham yozish) =======
router.post("/", upload.single("image"), (req, res) => {
  const { name, category, price, description, unit } = req.body;
  const image = req.file?.filename || "";

  if (!name || !category || !price || !unit) {
    return res.status(400).send("❌ Majburiy maydonlar to‘ldirilmagan");
  }

  db.run(
    `INSERT INTO products (name, category, price, image, description, unit)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, price, image, description || "", unit],
    function (err) {
      if (err) return res.status(500).send("❌ Saqlash xatosi: " + err.message);

      const newProductId = this.lastID;

      // ✅ Omborga avtomatik qo‘shish
      db.run(
        `INSERT INTO warehouse (product_id, quantity) VALUES (?, ?)`,
        [newProductId, 0],
        (err) => {
          if (err) {
            console.error("❌ Omborga yozishda xatolik:", err.message);
            return res.status(500).send("❌ Mahsulot qo‘shildi, lekin omborga yozilmadi");
          }

          res.send("✅ Mahsulot va Omborga muvaffaqiyatli qo‘shildi");
        }
      );
    }
  );
});

// ======= 2. Mahsulotlar ro‘yxatini olish =======
router.get("/", (req, res) => {
  db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).send("❌ O‘qishda xatolik: " + err.message);
    res.json(rows);
  });
});

// ======= 3. Mahsulotni o‘chirish =======
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send("❌ O‘chirishda xatolik: " + err.message);
    if (this.changes === 0) return res.status(404).send("❌ Mahsulot topilmadi");

    db.run("DELETE FROM warehouse WHERE product_id = ?", [id]);
    res.send("🗑️ Mahsulot (va ombordagi yozuvi) o‘chirildi");
  });
});

// ======= 4. Mahsulotni yangilash =======
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, unit } = req.body;

  if (!name || !category || !price || !unit) {
    return res.status(400).send("❌ Majburiy maydonlar to‘ldirilmagan");
  }

  db.run(
    `UPDATE products SET name = ?, category = ?, price = ?, description = ?, unit = ? WHERE id = ?`,
    [name, category, price, description || "", unit, id],
    function (err) {
      if (err) return res.status(500).send("❌ Yangilashda xatolik: " + err.message);
      if (this.changes === 0) return res.status(404).send("❌ Mahsulot topilmadi");
      res.send("✏️ Mahsulot yangilandi");
    }
  );
});

module.exports = router;

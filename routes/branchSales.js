const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ✅ Yangi filial sotuvini qo‘shish
router.post("/", (req, res) => {
  console.log("📥 POST /branch-sales qabul qilindi");
  console.log("➡️ So‘rov body:", req.body);

  let { branch, product, quantity, unit, price, date, source } = req.body;

  if (!branch || !product || !quantity || !unit || !price || !date) {
    console.log("⚠️ Maydonlar to‘liq emas:", req.body);
    return res.status(400).send("❌ Barcha maydonlar to‘ldirilishi kerak");
  }

  // 🔄 Formatlash
  const qty = parseFloat(quantity);
  price = parseInt(price);

  if (isNaN(qty) || isNaN(price)) {
    console.log("⚠️ Miqdor yoki narx noto‘g‘ri:", { qty, price });
    return res.status(400).send("❌ Miqdor yoki narx noto‘g‘ri formatda kiritilgan");
  }

  // 🔍 Mahsulot ID sini topamiz
  db.get(`SELECT id FROM products WHERE name = ?`, [product], (err, found) => {
    if (err) {
      console.log("❌ Mahsulotni topishda xatolik:", err.message);
      return res.status(500).send("❌ Mahsulotni izlashda xatolik");
    }
    if (!found) {
      console.log("❌ Mahsulot topilmadi:", product);
      return res.status(404).send("❌ Mahsulot topilmadi");
    }

    const productId = found.id;
    console.log("🔎 Topilgan mahsulot ID:", productId);

    // 🧾 Ombordagi mavjud miqdorni tekshirish
    db.get(
      `SELECT quantity FROM warehouse WHERE product_id = ? AND unit = ?`,
      [productId, unit],
      (err, row) => {
        if (err) {
          console.log("❌ Ombor tekshiruvida xatolik:", err.message);
          return res.status(500).send("❌ Ombor tekshiruvida xatolik");
        }

        if (!row) {
          console.log("⚠️ Omborda bu mahsulot yo‘q:", productId, unit);
          return res.status(400).send("❌ Omborda bu mahsulot topilmadi");
        }

        const availableQty = parseFloat(row.quantity);
        if (isNaN(availableQty)) {
          console.log("⚠️ Ombordagi quantity noto‘g‘ri:", row.quantity);
          return res.status(500).send("❌ Ombordagi miqdor noto‘g‘ri formatda");
        }

        console.log(`📦 Omborda mavjud: ${availableQty} ${unit}, So‘ralgan: ${qty} ${unit}`);

        if (availableQty < qty) {
          return res.status(400).send(`❌ Omborda yetarli mahsulot yo‘q. Bor: ${availableQty} ${unit}`);
        }

        // ✅ Sotuvni qo‘shamiz
        db.run(
          `INSERT INTO branch_sales (branch, product, quantity, unit, price, date, source)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [branch, product, qty, unit, price, date, source || null],
          function (err) {
            if (err) {
              console.log("❌ Sotuvni saqlashda xatolik:", err.message);
              return res.status(500).send("❌ Saqlashda xatolik: " + err.message);
            }

            console.log("✅ Sotuv saqlandi, endi omborni yangilaymiz");

            // 🔄 Ombordagi miqdorni yangilaymiz
            const newQty = availableQty - qty;
            db.run(
              `UPDATE warehouse SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ? AND unit = ?`,
              [newQty, productId, unit],
              err => {
                if (err) {
                  console.log("❌ Omborni yangilashda xatolik:", err.message);
                  return res.status(500).send("❌ Omborni yangilashda xatolik");
                }

                console.log(`📉 Ombor yangilandi: ${newQty} ${unit} qoldi`);
                res.send("✅ Sotuv saqlandi va ombordagi miqdor yangilandi");
              }
            );
          }
        );
      }
    );
  });
});

// ✅ Sotuvlarni olish (sana bo‘yicha filter bilan)
router.get("/", (req, res) => {
  const { date } = req.query;
  const query = date
    ? `SELECT * FROM branch_sales WHERE date = ?`
    : `SELECT * FROM branch_sales`;

  db.all(query, date ? [date] : [], (err, rows) => {
    if (err) {
      console.log("❌ Sotuvlarni o‘qishda xatolik:", err.message);
      return res.status(500).send("❌ O‘qishda xatolik");
    }

    console.log(`📊 ${rows.length} ta sotuv yozuvi topildi`);
    res.json(rows);
  });
});

module.exports = router;

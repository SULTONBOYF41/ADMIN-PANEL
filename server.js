  // ======= SETUP =======
  const express = require("express");
  const cors = require("cors");
  const multer = require("multer");
  const path = require("path");
  const app = express();
  const PORT = 3000;

  // ======= FILE UPLOAD SETUP =======
  const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  // ======= MIDDLEWARE =======
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public"))); // HTML va JS fayllar shu yerda
  app.use('/uploads', express.static('uploads'));
  app.use('/warehouse', express.static(path.join(__dirname, 'public/warehouse')));

  // ======= ROUTES =======
  app.use("/report", require("./routes/report"));
  app.use("/products", require("./routes/products"));
  app.use("/production", require("./routes/production"));
  app.use("/expenses", require("./routes/expenses"));
  app.use("/orders", require("./routes/orders"));
  app.use("/branch-sales", require("./routes/branchSales"));
  app.use("/api/warehouse", require("./routes/warehouse")); // faqat bitta backend route

  // ======= SERVER =======
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
  });



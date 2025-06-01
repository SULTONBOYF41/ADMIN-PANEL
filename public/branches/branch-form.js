document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");
  const sidebar = document.getElementById("sidebar");
  const form = document.getElementById("sell-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const statusMessage = document.getElementById("status-message");

  // 🔄 Mahsulotlarni yuklash
  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/warehouse");
      if (!res.ok) throw new Error("Ma'lumotlarni olishda server xatosi");
      const products = await res.json();

      grid.innerHTML = ""; // eski kartalarni tozalash

      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="/uploads/${product.image}" alt="${product.name}" />
          <div class="card-body">
            <div class="card-title">${product.name}</div>
            <div class="card-sub">
              ${product.kg > 0 ? product.kg + " kg" : ""} 
              ${product.dona > 0 ? " • " + product.dona + " dona" : ""} 
              • ${product.category || ''}
            </div>
          </div>
        `;

        card.addEventListener("click", () => openSidebar(product));
        grid.appendChild(card);
      });
    } catch (err) {
      console.error("❌ Mahsulotlarni olishda xatolik:", err.message);
    }
  }

  // 📥 Panelni ochish va mahsulotni formaga to‘ldirish
  function openSidebar(product) {
    document.getElementById("sidebar-title").textContent = `${product.name} – Sotish`;
    document.getElementById("selected-product-name").value = product.name;
    document.getElementById("selected-unit").value = product.unit;

    form.reset();
    sidebar.classList.add("open");
  }

  // ❌ Panelni yopish
  cancelBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
    statusMessage.textContent = "";
  });

  // 📤 Sotuvni yuborish
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      branch: form.branch.value.trim(),
      product: form.product.value.trim(),
      unit: form.unit.value.trim(),
      quantity: parseFloat(form.quantity.value),
      price: parseInt(form.price.value.replaceAll(",", "")),
      date: form.date.value
    };

    statusMessage.textContent = "";
    statusMessage.style.color = "black";

    try {
      const res = await fetch("http://localhost:3000/branch-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const message = await res.text();

      if (!res.ok) {
        statusMessage.textContent = "❌ " + message;
        statusMessage.style.color = "red";
        return;
      }

      statusMessage.textContent = "✅ " + message;
      statusMessage.style.color = "green";

      form.reset();
      sidebar.classList.remove("open");
      loadProducts(); // mahsulot ro'yxatini qayta yuklash

    } catch (err) {
      statusMessage.textContent = "❌ Saqlashda xatolik: " + err.message;
      statusMessage.style.color = "red";
    }
  });

  // ▶️ Mahsulotlarni yuklashni boshlash
  loadProducts();
});

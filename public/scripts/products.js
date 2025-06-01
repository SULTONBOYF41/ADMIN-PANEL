// 📁 scripts/products.js

const productForm = document.getElementById("product-form");
const productList = document.getElementById("products-body");
const productTable = document.getElementById("product-table");
const addButton = document.getElementById("add-button");
const updateButton = document.getElementById("update-button");

export function initProductForm() {
  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(productForm);
      const editId = productForm.getAttribute("data-edit-id");

      try {
        let res, message;

        if (editId) {
          // Yangilash
          const updatedData = {
            name: formData.get("name"),
            category: formData.get("category"),
            price: formData.get("price"),
            unit: formData.get("unit"), // ✅ unit ham qo‘shildi
            description: formData.get("description")
          };

          res = await fetch(`/products/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
          });

          message = await res.text();
        } else {
          // Yangi qo‘shish (rasm bilan)
          res = await fetch("/products", {
            method: "POST",
            body: formData
          });

          message = await res.text();
        }

        alert(message);
        productForm.reset();
        productForm.removeAttribute("data-edit-id");
        addButton.style.display = "inline-block";
        updateButton.style.display = "none";

        loadProducts();
      } catch (err) {
        alert("❌ Saqlashda xatolik: " + err.message);
      }
    });

    updateButton.addEventListener("click", () => {
      productForm.dispatchEvent(new Event("submit"));
    });
  }

  if (productList) loadProducts();
}

export async function loadProducts() {
  try {
    const res = await fetch("/products");
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      if (productTable) productTable.style.display = "none";
      return;
    }

    productTable.style.display = "table";
    productList.innerHTML = "";

    data.forEach((product) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${product.image ? `<img src="/uploads/${product.image}" width="40">` : "-"}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price} so'm</td>
        <td>${product.description || "-"}</td>
        <td>
          <button onclick="editProduct(${product.id})">✏️</button>
          <button onclick="deleteProduct(${product.id})">🗑️</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  } catch (err) {
    alert("❌ Mahsulotlarni yuklashda xatolik: " + err.message);
  }
}

window.deleteProduct = async function (id) {
  if (!confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

  try {
    const res = await fetch(`/products/${id}`, {
      method: "DELETE"
    });
    const message = await res.text();
    alert(message);
    loadProducts();
  } catch (err) {
    alert("❌ O‘chirishda xatolik: " + err.message);
  }
};

window.editProduct = async function (id) {
  try {
    const res = await fetch("/products");
    const products = await res.json();
    const product = products.find(p => p.id === id);
    if (!product) return alert("Mahsulot topilmadi");

    productForm.name.value = product.name;
    productForm.category.value = product.category;
    productForm.price.value = product.price;
    productForm.description.value = product.description;
    productForm.unit.value = product.unit || ""; // ✅ unit formga yuklanadi

    productForm.setAttribute("data-edit-id", id);
    addButton.style.display = "none";
    updateButton.style.display = "inline-block";
  } catch (err) {
    alert("❌ Tahrirlashda xatolik: " + err.message);
  }
};

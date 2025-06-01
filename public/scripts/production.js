export function submitProduction(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;

  const product = {
    name: form.name.value.trim(),
    quantity: parseFloat(form.quantity.value),
    unit: form.unit.value.trim(),
    date: form.date.value
  };

  if (!product.name || !product.quantity || !product.unit || !product.date) {
    alert("Iltimos, barcha maydonlarni to‘ldiring.");
    button.disabled = false;
    return;
  }

  fetch("http://localhost:3000/production", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      form.reset();
      loadProduction(); // Jadvalni yangilash
      button.disabled = false;
    })
    .catch(() => {
      alert("❌ Ma’lumotni yuborishda xatolik yuz berdi.");
      button.disabled = false;
    });
}

export function loadProduction() {
  fetch("http://localhost:3000/production")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("production-list");
      tbody.innerHTML = "";

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.date}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(() => {
      console.error("❌ Ishlab chiqarish ma’lumotlarini olishda xatolik.");
    });
}
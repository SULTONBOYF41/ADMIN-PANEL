export function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;

  const order = {
    customer: form.customer.value.trim(),
    product: form.product.value.trim(),
    quantity: parseFloat(form.quantity.value),
    unit: form.unit.value.trim(),
    source: form.source.value.trim(),
    price: parseInt(form.price.value),
    date: form.date.value,
    note: form.note.value.trim()
  };

  if (!order.customer || !order.product || !order.quantity || !order.unit || !order.date || isNaN(order.price)) {
    alert("Barcha maydonlar to‘g‘ri to‘ldirilishi kerak!");
    button.disabled = false;
    return;
  }

  fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      form.reset();
      button.disabled = false;
    })
    .catch(() => {
      alert("Buyurtma qo‘shishda xatolik yuz berdi");
      button.disabled = false;
    });
}
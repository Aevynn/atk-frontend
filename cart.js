const API = "https://atk-backend2-production-0509.up.railway.app";

async function loadCart() {
  const res = await fetch(`${API}/cart`);
  const cart = await res.json();

  const container = document.getElementById("cart-list");
  container.innerHTML = "";

  let total = 0;

  cart.forEach(c => {
    total += c.price * c.qty;

    const div = document.createElement("div");
    div.className = "bg-white p-4 shadow rounded";

    div.innerHTML = `
      <h3 class="text-lg font-bold">${c.name}</h3>
      <p>Qty: ${c.qty}</p>
      <p>Harga: Rp${c.price}</p>
      <p>Total Item: Rp${c.price * c.qty}</p>
    `;

    container.appendChild(div);
  });

  document.getElementById("total-price").innerText = total;
}

document.getElementById("checkout-btn").addEventListener("click", async () => {
  alert("Checkout berhasil! (simulasi)");
});

loadCart();

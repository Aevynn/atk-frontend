const API = "https://atk-backend2-production-0509.up.railway.app";

async function loadAdminProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  const container = document.getElementById("admin-product-list");
  container.innerHTML = "";

  products.forEach(p => {
    const box = document.createElement("div");
    box.className = "bg-white p-4 shadow rounded";

    box.innerHTML = `
      <h3 class="text-xl font-bold">${p.name}</h3>
      <p>Harga: Rp${p.price}</p>
      <label class="block mt-2">Stok:</label>
      <input type="number" id="stock-${p.id}" value="${p.stock}"
        class="border p-2 rounded w-32">

      <button class="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        onclick="updateStock(${p.id})">
        Update
      </button>
    `;

    container.appendChild(box);
  });
}

async function updateStock(id) {
  const newStock = document.getElementById(`stock-${id}`).value;

  await fetch(`${API}/update-stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, stock: Number(newStock) })
  });

  alert("Stok diperbarui!");
}

loadAdminProducts();

const API = "https://atk-backend2-production-0509.up.railway.app";

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white shadow p-4 rounded";

    card.innerHTML = `
      <h3 class="text-xl font-bold">${p.name}</h3>
      <p class="mt-1">Harga: Rp${p.price}</p>
      <p>Stok: ${p.stock}</p>
      <button class="mt-3 bg-blue-500 text-white px-4 py-2 rounded add-cart"
        data-id="${p.id}">
        Tambah ke Keranjang
      </button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      // user belum login → redirect ke login
      window.location.href = "cart.html";
    });
  });
}

loadProducts();

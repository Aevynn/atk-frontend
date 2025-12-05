const API = "https://atk-backend2-production-0509.up.railway.app";

// Render navbar
function renderNavbar() {
  const nav = document.getElementById("nav-right");
  const user = localStorage.getItem("atk_user");

  if (!user) {
    nav.innerHTML = `
      <a href="login.html" class="text-blue-600">Login</a>
    `;
  } else {
    const parsed = JSON.parse(user);

    nav.innerHTML = `
      <span class="font-semibold">Hi, ${parsed.username}</span>
      <a href="cart.html" class="text-blue-600">Keranjang</a>
      ${parsed.role === "admin" ? `<a href="admin.html" class="text-blue-600">Admin</a>` : ""}
      <button id="logout-btn" class="text-red-600">Logout</button>
    `;

    document.getElementById("logout-btn").onclick = () => {
      localStorage.removeItem("atk_user");
      window.location.reload();
    };
  }
}

renderNavbar();

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
      <p>Harga: Rp${p.price}</p>
      <p>Stok: ${p.stock}</p>
      <button class="mt-3 bg-blue-600 text-white px-4 py-2 rounded add-cart"
        data-id="${p.id}">
        Tambah ke Keranjang
      </button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const user = localStorage.getItem("atk_user");

      if (!user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
      }

      window.location.href = "cart.html";
    });
  });
}

loadProducts();

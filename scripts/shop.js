// shop.js — mini-cart on same page
let CART = [];

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user) { alert("Silakan login"); window.location.href = "login.html"; return; }

  document.getElementById("user-greet").textContent = `Hi, ${user.username}`;

  await loadProducts();
  loadCartFromStorage();
  renderCart();
});

async function loadProducts() {
  const products = await apiGet("/products");
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";

    card.innerHTML = `
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-sm text-gray-600">Rp ${p.price}</p>
      <p class="text-sm text-gray-600">Stok: ${p.stock}</p>
      <div class="mt-3 flex space-x-2">
        <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function loadCartFromStorage() {
  CART = JSON.parse(localStorage.getItem("atk_cart") || "[]");
}

function saveCartToStorage() {
  localStorage.setItem("atk_cart", JSON.stringify(CART));
}

function addToCart(id) {
  const existing = CART.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else CART.push({ id, qty: 1 });

  saveCartToStorage();
  renderCart();
}

function renderCart() {
  const cartBox = document.getElementById("mini-cart");
  cartBox.innerHTML = "";
  let total = 0;

  // fetch product data for price/ name
  apiGet("/products").then(products => {
    CART.forEach(item => {
      const p = products.find(x => Number(x.id) === Number(item.id));
      const subtotal = p.price * item.qty;
      total += subtotal;
      const el = document.createElement("div");
      el.innerHTML = `<div class="flex justify-between"><div>${p.name} x ${item.qty}</div><div>Rp ${subtotal}</div></div>`;
      cartBox.appendChild(el);
    });
    document.getElementById("cart-total").textContent = total;
  });
}

async function checkout() {
  if (CART.length === 0) return alert("Keranjang kosong");
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user) return alert("Login dulu");

  const res = await apiPost("/checkout", { userId: user.id, cart: CART });
  if (!res || !res.success) { alert(res?.message || "Checkout gagal"); return; }

  // clear cart
  CART = [];
  saveCartToStorage();
  renderCart();
  alert("Checkout berhasil — total Rp " + res.transaction.total);
  // refresh products to show updated stocks
  await loadProducts();
}
function logout() { localStorage.removeItem("atk_user"); window.location.href = "index.html"; }

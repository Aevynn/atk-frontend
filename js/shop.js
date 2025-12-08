// shop page logic: load products, mini-cart, orders (user)
let CART = [];

function logout() { localStorage.removeItem("atk_user"); localStorage.removeItem("atk_cart"); window.location='index.html'; }
function goToCart(){ window.location='cart.html'; }

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user) { alert("Silakan login"); window.location = "login.html"; return; }
  document.getElementById("userGreeting").textContent = `Hi, ${user.username}`;

  loadProducts();
  loadCartFromStorage();
  renderMiniCart();
  loadMyOrders();
});

async function loadProducts() {
  const products = await apiGet("/products");
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "bg-white p-4 rounded shadow";
    el.innerHTML = `
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-sm text-gray-600">Rp ${p.price}</p>
      <p class="text-sm text-gray-600">Stok: ${p.stock}</p>
      <div class="mt-2">
        <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

function loadCartFromStorage() { CART = JSON.parse(localStorage.getItem("atk_cart") || "[]"); }
function saveCartToStorage() { localStorage.setItem("atk_cart", JSON.stringify(CART)); }

function addToCart(id) {
  const item = CART.find(i => i.id === id);
  if (item) item.qty += 1; else CART.push({ id, qty: 1 });
  saveCartToStorage();
  renderMiniCart();
}

async function renderMiniCart(){
  const box = document.getElementById("miniCart");
  box.innerHTML = "";
  let total=0;
  const products = await apiGet("/products");
  CART.forEach(i=>{
    const p = products.find(x=>x.id===i.id);
    if(!p) return;
    total += p.price * i.qty;
    const div = document.createElement("div");
    div.innerHTML = `<div class="flex justify-between"><div>${p.name} x ${i.qty}</div><div>Rp ${p.price * i.qty}</div></div>`;
    box.appendChild(div);
  });
  document.getElementById("miniTotal").textContent = total;
}

// orders for this user
async function loadMyOrders(){
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if(!user) return;
  // server has endpoint /admin/orders (all) and transactions stored; we will filter client-side
  const orders = await apiGet("/admin/orders");
  const mine = orders.filter(o => o.username === user.username);
  const el = document.getElementById("myOrders");
  if(!el) return;
  if (mine.length===0) el.innerHTML = '<div class="text-sm text-gray-500">Belum ada pesanan</div>';
  else el.innerHTML = mine.map(o => `<div class="bg-white p-2 rounded shadow-sm">${o.id} — Rp ${o.items.reduce((s,i)=>s+(i.qty * (i.price || 0)),0) || o.items.reduce((s,i)=>s + (i.qty*0),0)} — <span class="font-semibold">${o.status || 'Processing'}</span></div>`).join('');
}

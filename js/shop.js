// js/shop.js
// uses api.js and auth.js (getUser)

function rupiah(n){ return new Intl.NumberFormat('id-ID').format(n); }

async function loadProducts() {
  const products = await apiGet('/products');
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'bg-white p-4 rounded shadow';
    el.innerHTML = `
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-sm text-gray-600">Rp ${rupiah(p.price)}</p>
      <p class="text-sm text-gray-600">Stok: ${p.stock ?? 0}</p>
      <div class="mt-2">
        <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

function getCart(){ return JSON.parse(localStorage.getItem('atk_cart') || '[]'); }
function saveCart(c){ localStorage.setItem('atk_cart', JSON.stringify(c)); }

async function addToCart(id) {
  const user = getUser();
  if (!user) { alert('Silakan login dulu'); window.location='login.html'; return; }

  const products = await apiGet('/products');
  const p = products.find(x => x.id === id);
  if (!p) return alert('Produk tidak ditemukan');
  if (p.stock <= 0) return alert('Stok habis');

  let cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) found.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  saveCart(cart);
  renderMiniCart();
  alert('Ditambahkan ke keranjang');
}

function renderMiniCart() {
  const cart = getCart();
  const box = document.getElementById('miniCart');
  if (!box) return;
  box.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.innerHTML = `<div class="flex justify-between"><div>${item.name} x ${item.qty}</div><div>Rp ${rupiah(item.price * item.qty)}</div></div>`;
    box.appendChild(div);
  });
  const el = document.getElementById('miniTotal');
  if (el) el.textContent = rupiah(total);
}

function goToCart(){ window.location = 'cart.html'; }

// ensure logout function from auth.js exists; if not create fallback
if (!window.logout) window.logout = function(){ localStorage.removeItem('atk_user'); localStorage.removeItem('atk_cart'); window.location='index.html'; };

// init
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  // if not logged in redirect to login
  if (!user) { window.location = 'login.html'; return; }
  const greeting = document.getElementById('userGreeting');
  if (greeting) greeting.textContent = `Hi, ${user.username}`;
  loadProducts();
  renderMiniCart();
  loadMyOrders();
});

async function loadMyOrders(){
  const user = getUser();
  if (!user) return;
  const all = await apiGet('/transactions');
  const mine = all.filter(t => t.username === user.username);
  const el = document.getElementById('myOrders');
  if (!el) return;
  if (mine.length === 0) el.innerHTML = '<div class="text-sm text-gray-500">Belum ada pesanan</div>';
  else el.innerHTML = mine.map(o => `<div class="bg-white p-2 rounded shadow-sm">${o.id} — Rp ${rupiah(o.total)} — <span class="font-semibold">${o.status}</span></div>`).join('');
}

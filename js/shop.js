// load products, mini cart, add to cart
async function loadProducts() {
  const products = await apiGet('/products');
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'bg-white p-4 rounded shadow';
    el.innerHTML = `
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-sm text-gray-600">Rp ${p.price}</p>
      <p class="text-sm text-gray-600">Stok: ${p.stock ?? 0}</p>
      <div class="mt-2">
        <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

function getCart() {
  return JSON.parse(localStorage.getItem('atk_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('atk_cart', JSON.stringify(cart));
}

async function addToCart(id) {
  const products = await apiGet('/products');
  const p = products.find(x => x.id === id);
  if (!p) return alert('Product not found');
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
    div.innerHTML = `<div class="flex justify-between"><div>${item.name} x ${item.qty}</div><div>Rp ${item.price * item.qty}</div></div>`;
    box.appendChild(div);
  });
  document.getElementById('miniTotal').textContent = total;
}

function goToCart() { window.location = 'cart.html'; }
function logout() { localStorage.removeItem('atk_user'); localStorage.removeItem('atk_cart'); window.location='index.html'; }

// init on shop page
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('atk_user') || 'null');
  if (!user) { window.location = 'login.html'; return; }
  document.getElementById('userGreeting').textContent = `Hi, ${user.username}`;
  loadProducts();
  renderMiniCart();
  // load user's orders summary
  loadMyOrders();
});

async function loadMyOrders() {
  const user = JSON.parse(localStorage.getItem('atk_user') || 'null');
  if (!user) return;
  const all = await apiGet('/transactions');
  const mine = all.filter(t => t.username === user.username);
  const el = document.getElementById('myOrders');
  if (!el) return;
  if (mine.length === 0) el.innerHTML = '<div class="text-sm text-gray-500">Belum ada pesanan</div>';
  else el.innerHTML = mine.map(o => `<div class="bg-white p-2 rounded shadow-sm">${o.id} — Rp ${o.total} — <span class="font-semibold">${o.status}</span></div>`).join('');
}

// js/cart.js
function rupiah(n){ return new Intl.NumberFormat('id-ID').format(n); }

function renderCartPage() {
  const cart = JSON.parse(localStorage.getItem('atk_cart') || '[]');
  const list = document.getElementById('cartList');
  list.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow flex justify-between';
    div.innerHTML = `<div><div class="font-semibold">${item.name}</div><div class="text-sm text-gray-600">Rp ${rupiah(item.price)} x ${item.qty}</div></div>
      <div class="flex gap-2"><button onclick="changeQty(${item.id}, -1)" class="px-2 py-1 border rounded">-</button><button onclick="changeQty(${item.id}, 1)" class="px-2 py-1 border rounded">+</button></div>`;
    list.appendChild(div);
  });
  document.getElementById('cartTotal').textContent = rupiah(total);
}

function changeQty(id, delta) {
  const user = getUser();
  if (!user) { alert('Silakan login'); window.location='login.html'; return; }

  const cart = JSON.parse(localStorage.getItem('atk_cart') || '[]');
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx,1);
  localStorage.setItem('atk_cart', JSON.stringify(cart));
  renderCartPage();
}

async function doCheckout() {
  const user = getUser();
  if (!user) { alert('Silakan login'); window.location='login.html'; return; }
  const cart = JSON.parse(localStorage.getItem('atk_cart') || '[]');
  if (!cart.length) { alert('Keranjang kosong'); return; }

  const res = await apiPost('/checkout', { username: user.username, cart });
  if (!res || !res.success) { alert(res?.message || 'Checkout gagal'); return; }
  alert('Checkout sukses. ID: ' + res.transaction.id);
  localStorage.removeItem('atk_cart');
  window.location = 'shop.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!user) { window.location='login.html'; return; }
  renderCartPage();
});

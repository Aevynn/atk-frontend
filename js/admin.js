// js/admin.js
function rupiah(n){ return new Intl.NumberFormat('id-ID').format(n); }

function showTab(tab) {
  document.getElementById('panelProducts').classList.toggle('hidden', tab !== 'products');
  document.getElementById('panelOrders').classList.toggle('hidden', tab !== 'orders');
  document.getElementById('tabProducts').className = tab==='products' ? 'px-4 py-2 bg-blue-600 text-white rounded' : 'px-4 py-2 bg-gray-200 rounded';
  document.getElementById('tabOrders').className = tab==='orders' ? 'px-4 py-2 bg-blue-600 text-white rounded' : 'px-4 py-2 bg-gray-200 rounded';
  if (tab === 'orders') loadOrdersAdmin();
  if (tab === 'products') loadProductsAdmin();
}

async function loadProductsAdmin() {
  const products = await apiGet('/products');
  const box = document.getElementById('productTable');
  box.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';
    div.innerHTML = `<div><div class="font-semibold">${p.name}</div><div class="text-sm text-gray-600">Rp ${rupiah(p.price)}</div></div>
      <div class="flex items-center gap-2">
        <input id="st-${p.id}" type="number" value="${p.stock}" class="w-20 border p-1 rounded">
        <button onclick="updateStock(${p.id})" class="bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        <button onclick="removeProduct(${p.id})" class="bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
      </div>`;
    box.appendChild(div);
  });
}

async function updateStock(id) {
  const v = Number(document.getElementById('st-' + id).value);
  if (isNaN(v) || v < 0) return alert('Stok tidak valid');
  await apiPost('/products/update', { id, stock: v });
  alert('Stok diperbarui');
  loadProductsAdmin();
}

async function addProduct() {
  const name = document.getElementById('newName').value.trim();
  const price = Number(document.getElementById('newPrice').value);
  const stock = Number(document.getElementById('newStock').value);
  if (!name || !price) return alert('Isi nama & harga');
  await apiPost('/products/add', { name, price, stock });
  alert('Produk ditambahkan');
  loadProductsAdmin();
}

async function removeProduct(id) {
  if (!confirm('Hapus produk?')) return;
  await apiPost('/products/update', { id, stock: 0 });
  alert('Produk diset stok 0');
  loadProductsAdmin();
}

async function loadOrdersAdmin() {
  const orders = await apiGet('/transactions');
  const box = document.getElementById('ordersTable');
  box.innerHTML = '';
  orders.forEach(o => {
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';
    div.innerHTML = `<div>
        <div class="font-semibold">Order #${o.id}</div>
        <div class="text-sm text-gray-600">User: ${o.username} — Total: Rp ${rupiah(o.total)}</div>
        <div class="text-sm">Status: <span class="font-medium">${o.status}</span></div>
      </div>
      <div>
        ${o.status === 'Completed' ? '<span class="text-green-700">✔ Selesai</span>' : `
          <select id="sel-${o.id}" class="border p-1 rounded">
            <option value="Processing" ${o.status==="Processing"?"selected":""}>Processing</option>
            <option value="Shipped" ${o.status==="Shipped"?"selected":""}>Shipped</option>
            <option value="Completed" ${o.status==="Completed"?"selected":""}>Completed</option>
          </select>
          <button onclick="updateOrderStatus('${o.id}')" class="ml-2 bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        `}
      </div>`;
    box.appendChild(div);
  });
}

async function updateOrderStatus(id) {
  const sel = document.getElementById('sel-' + id);
  const newStatus = sel.value;
  const res = await apiPost('/transactions/update', { id: id, status: newStatus }).catch(()=>null);
  if (!res || !res.success) return alert(res?.message || 'Failed');
  alert('Status diperbarui');
  loadOrdersAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
  const u = getUser();
  if (!u || u.role !== 'admin') { window.location='login.html'; return; }
  showTab('products');
});

function showTab(tab) {
  document.getElementById('panelProducts').classList.toggle('hidden', tab !== 'products');
  document.getElementById('panelOrders').classList.toggle('hidden', tab !== 'orders');
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
    div.innerHTML = `<div><div class="font-semibold">${p.name}</div><div class="text-sm text-gray-600">Rp ${p.price}</div></div>
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
  // simple: set stock to 0
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
        <div class="text-sm text-gray-600">User: ${o.username} — Total: Rp ${o.total}</div>
        <div class="text-sm">Status: <span class="font-medium">${o.status}</span></div>
      </div>
      <div>
        ${o.status === 'Completed' ? '<span class="text-green-700">✔ Selesai</span>' : `
          <select id="sel-${o.id}" class="border p-1 rounded">
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
          </select>
          <button onclick="updateOrderStatus(${o.id})" class="ml-2 bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        `}
      </div>`;
    box.appendChild(div);
  });
}

async function updateOrderStatus(id) {
  const sel = document.getElementById('sel-' + id);
  const newStatus = sel.value;
  const res = await apiPost('/transactions/update', { id: 'T-' + id, status: newStatus })
    .catch(() => null);
  // Note: transaction ids start with 'T-' in backend; ensure correct id passed; we standardize below
  // to keep compatibility, admin buttons send numeric id (timestamp). We'll accept both forms server-side.
  if (res && !res.success) alert(res.message || 'Failed');
  loadOrdersAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
  showTab('products');
});

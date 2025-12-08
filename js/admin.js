// ===========================
// Format Rupiah
// ===========================
function rupiah(x) {
  return new Intl.NumberFormat('id-ID').format(x);
}

// ===========================
// TAB SWITCHING
// ===========================
function showTab(tab) {
  document.getElementById('panelProducts').classList.toggle('hidden', tab !== 'products');
  document.getElementById('panelOrders').classList.toggle('hidden', tab !== 'orders');

  document.getElementById('tabProducts').className =
    tab === 'products'
      ? "px-4 py-2 bg-blue-600 text-white rounded"
      : "px-4 py-2 bg-gray-200 rounded";

  document.getElementById('tabOrders').className =
    tab === 'orders'
      ? "px-4 py-2 bg-blue-600 text-white rounded"
      : "px-4 py-2 bg-gray-200 rounded";

  if (tab === 'products') loadProductsAdmin();
  if (tab === 'orders') loadOrdersAdmin();
}

// ===========================
// LOAD PRODUCTS
// ===========================
async function loadProductsAdmin() {
  const products = await apiGet('/products');
  const box = document.getElementById('productTable');
  box.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';
    div.innerHTML = `
      <div>
        <div class="font-semibold">${p.name}</div>
        <div class="text-sm text-gray-600">Rp ${rupiah(p.price)}</div>
      </div>
      <div class="flex items-center gap-2">
        <input id="st-${p.id}" type="number" value="${p.stock}"
               class="w-20 border p-1 rounded">
        <button onclick="updateStock(${p.id})"
                class="bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        <button onclick="removeProduct(${p.id})"
                class="bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
      </div>
    `;
    box.appendChild(div);
  });
}

// ===========================
// UPDATE STOCK
// ===========================
async function updateStock(id) {
  const v = Number(document.getElementById('st-' + id).value);
  if (v < 0) return alert("Stok tidak valid");

  await apiPost('/products/update', { id, stock: v });
  alert('Stok diperbarui');
  loadProductsAdmin();
}

// ===========================
// ADD PRODUCT
// ===========================
async function addProduct() {
  const name = document.getElementById('newName').value.trim();
  const price = Number(document.getElementById('newPrice').value);
  const stock = Number(document.getElementById('newStock').value);

  if (!name) return alert('Nama wajib diisi');
  if (price <= 0) return alert('Harga tidak valid');
  if (stock < 0) return alert('Stok minimal 0');

  await apiPost('/products/add', { name, price, stock });

  alert('Produk berhasil ditambahkan');
  loadProductsAdmin();
}

// ===========================
// REMOVE PRODUCT
// ===========================
async function removeProduct(id) {
  if (!confirm("Hapus produk ini?")) return;

  // Jika backend Anda punya endpoint delete, gunakan:
  // await apiPost('/products/delete', { id });

  // Jika hanya update stok ke 0:
  await apiPost('/products/update', { id, stock: 0 });

  alert('Produk berhasil dihapus');
  loadProductsAdmin();
}

// ===========================
// LOAD ORDERS
// ===========================
async function loadOrdersAdmin() {
  const orders = await apiGet('/transactions');
  const box = document.getElementById('ordersTable');
  box.innerHTML = '';

  orders.forEach(o => {
    const transId = o.id.startsWith("T-") ? o.id : "T-" + o.id;

    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';
    div.innerHTML = `
      <div>
        <div class="font-semibold">Order #${transId}</div>
        <div class="text-sm text-gray-600">
          User: ${o.username} — Total: Rp ${rupiah(o.total)}
        </div>
        <div class="text-sm">Status:
          <span class="font-medium">${o.status}</span>
        </div>
      </div>

      <div>
        ${
          o.status === "Completed"
            ? '<span class="text-green-700 font-semibold">✔ Selesai</span>'
            : `
          <select id="sel-${transId}" class="border p-1 rounded">
            <option value="Processing" ${o.status==="Processing"?"selected":""}>Processing</option>
            <option value="Shipped" ${o.status==="Shipped"?"selected":""}>Shipped</option>
            <option value="Completed" ${o.status==="Completed"?"selected":""}>Completed</option>
          </select>
          <button onclick="updateOrderStatus('${transId}')"
                  class="ml-2 bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        `
        }
      </div>
    `;
    box.appendChild(div);
  });
}

// ===========================
// UPDATE ORDER STATUS
// ===========================
async function updateOrderStatus(id) {
  const sel = document.getElementById('sel-' + id);
  const newStatus = sel.value;

  const res = await apiPost('/transactions/update', {
    id: id, // langsung kirim "T-xxxx"
    status: newStatus
  });

  if (!res || !res.success) {
    alert(res?.message || "Gagal memperbarui status");
    return;
  }

  alert("Status pesanan diperbarui");
  loadOrdersAdmin();
}

// ===========================
// CHECK ADMIN LOGIN
// ===========================
function checkAdmin() {
  const u = JSON.parse(localStorage.getItem('atk_user') || 'null');

  if (!u || u.username !== 'admin') {
    alert("Akses khusus admin.");
    window.location = "login.html";
  }
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  checkAdmin();
  showTab('products');
});

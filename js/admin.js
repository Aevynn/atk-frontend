// admin page controls
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user || user.role !== "admin") { alert("Admin only"); window.location='login.html'; return; }
  showTab('products');
  loadProductsAdmin();
});

function showTab(tab){
  document.getElementById('panelProducts').classList.toggle('hidden', tab!=='products');
  document.getElementById('panelOrders').classList.toggle('hidden', tab!=='orders');
  document.getElementById('tabProducts').classList.toggle('bg-blue-600', tab==='products');
  document.getElementById('tabProducts').classList.toggle('bg-gray-200', tab!=='products');
  document.getElementById('tabOrders').classList.toggle('bg-blue-600', tab==='orders');
  document.getElementById('tabOrders').classList.toggle('bg-gray-200', tab!=='orders');
  if(tab==='orders') loadOrdersAdmin();
  if(tab==='products') loadProductsAdmin();
}

// PRODUCTS admin
async function loadProductsAdmin(){
  const prods = await apiGet("/products");
  const box = document.getElementById("productTable");
  box.innerHTML = "";
  prods.forEach(p=>{
    const el = document.createElement("div");
    el.className = "bg-white p-3 rounded shadow flex justify-between items-center";
    el.innerHTML = `<div><div class="font-semibold">${p.name}</div><div class="text-sm text-gray-600">Rp ${p.price}</div></div>
      <div class="flex items-center gap-2">
        <input id="st-${p.id}" type="number" value="${p.stock}" class="w-20 border p-1 rounded">
        <button onclick="updateStock(${p.id})" class="bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        <button onclick="removeProduct(${p.id})" class="bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
      </div>`;
    box.appendChild(el);
  });
}

async function updateStock(id){
  const v = Number(document.getElementById("st-"+id).value);
  const res = await apiPost("/products/update", { id, newStock: v });
  if (res && res.message) { alert('Sukses'); loadProductsAdmin(); }
}
async function removeProduct(id){
  // simple remove: fetch products, filter, write via add endpoint not available — so workaround: call products, then POST products/add? 
  // To keep backend minimal, we will mark removal by updating stock to 0 and name suffix.
  const pList = await apiGet("/products");
  const p = pList.find(x=>x.id===id);
  if(!p) return;
  const res = await apiPost("/products/update", { id, newStock: 0 });
  if(res) { alert('Ditetapkan stok 0 (hapus simulasi)'); loadProductsAdmin(); }
}

async function addProduct(){
  const name = document.getElementById("newName").value.trim();
  const price = Number(document.getElementById("newPrice").value);
  const stock = Number(document.getElementById("newStock").value);
  if(!name || !price) return alert('Isi nama & harga');
  const res = await apiPost("/products/add", { name, price, stock });
  if(res && res.message) { alert('Produk ditambahkan'); document.getElementById("newName").value=''; document.getElementById("newPrice").value=''; document.getElementById("newStock").value=''; loadProductsAdmin(); }
}

// ORDERS admin
async function loadOrdersAdmin(){
  const orders = await apiGet("/admin/orders");
  const box = document.getElementById("ordersTable");
  box.innerHTML = "";
  orders.forEach(o=>{
    const el = document.createElement("div");
    el.className = "bg-white p-3 rounded shadow flex justify-between items-center";
    el.innerHTML = `<div>
        <div class="font-semibold">Order #${o.id} — ${o.username}</div>
        <div class="text-sm text-gray-600">Items: ${o.items.map(it=>it.id+ 'x'+it.qty).join(', ')}</div>
        <div class="text-sm">Status: <span class="font-medium">${o.status}</span></div>
      </div>
      <div>
        <select id="sel-${o.id}" class="border p-1 rounded">
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
        <button onclick="updateOrderStatus(${o.id})" class="ml-2 bg-blue-600 text-white px-3 py-1 rounded">Update</button>
      </div>`;
    box.appendChild(el);
  });
}

async function updateOrderStatus(id){
  const sel = document.getElementById("sel-"+id);
  const newStatus = sel.value;
  const res = await apiPost("/admin/orders/updateStatus", { id, newStatus });
  if(res && res.message) { alert('Status diupdate'); loadOrdersAdmin(); }
}

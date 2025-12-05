document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user || user.role !== "admin") { alert("Admin only"); window.location.href = "login.html"; return; }
  await loadAdmin();
});

async function loadAdmin() {
  const products = await apiGet("/products");
  const incomeRes = await apiGet("/transactions/income");

  const adminList = document.getElementById("admin-list");
  adminList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";
    div.innerHTML = `
      <div class="flex justify-between"><div>
        <div class="font-semibold">${p.name}</div>
        <div class="text-sm text-gray-600">Rp ${p.price}</div>
      </div>
      <div>
        <input id="st-${p.id}" type="number" class="w-20 border p-1 rounded" value="${p.stock}">
        <button class="ml-2 bg-blue-600 text-white px-3 py-1 rounded" onclick="updateStock(${p.id})">Update</button>
      </div></div>
    `;
    adminList.appendChild(div);
  });

  document.getElementById("income").textContent = `Total pendapatan: Rp ${incomeRes.totalIncome}`;

  const txs = incomeRes.transactions || [];
  const txList = document.getElementById("tx-list");
  txList.innerHTML = txs.map(t => `<div class="bg-white p-3 rounded shadow">#${t.id} — Rp ${t.total} — ${new Date(t.createdAt).toLocaleString()}</div>`).join("");
}

async function updateStock(id) {
  const v = Number(document.getElementById("st-" + id).value);
  const res = await apiPost("/products/update", { id, stock: v });
  if (res && res.success) { alert("Stock updated"); loadAdmin(); } else alert("Failed");
}
function logout(){ localStorage.removeItem("atk_user"); window.location.href="index.html"; }

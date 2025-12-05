const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") window.location = "login.html";

async function loadAdmin() {
    const prod = await (await fetch(API + "/products")).json();
    const inc = await (await fetch(API + "/admin/income")).json();

    document.getElementById("income").innerText = "Total Pendapatan: Rp " + inc.income;

    const pbox = document.getElementById("admin-products");
    pbox.innerHTML = "";

    prod.forEach(p => {
        pbox.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <p>Rp ${p.price}</p>
                <p>Stok: ${p.stock}</p>
                <input id="st${p.id}" type="number" value="${p.stock}">
                <button onclick="updateStock(${p.id})">Update</button>
            </div>
        `;
    });

    const tbox = document.getElementById("transactions");
    tbox.innerHTML = "";

    inc.transactions.forEach(t => {
        tbox.innerHTML += `<p>Transaksi #${t.id} — Rp ${t.total}</p>`;
    });
}

async function updateStock(id) {
    const newStock = Number(document.getElementById("st" + id).value);

    const res = await fetch(API + "/products/update", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ id, stock: newStock })
    });

    const data = await res.json();

    if (data.success) {
        alert("Stok diperbarui");
        loadAdmin();
    }
}

loadAdmin();

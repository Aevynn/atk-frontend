async function loadAdmin() {
    const products = await apiGet("/products");
    const income = await apiGet("/transactions/income");

    const table = document.getElementById("admin-products");
    document.getElementById("income").innerText = `Rp ${income.total}`;

    table.innerHTML = "";

    products.forEach(p => {
        table.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>Rp ${p.price}</td>
          <td><input id="stok-${p.id}" type="number" value="${p.stock}" /></td>
          <td><button onclick="updateStock(${p.id})" class="btn-small">Update</button></td>
        </tr>
        `;
    });
}

async function updateStock(id) {
    const val = document.getElementById(`stok-${id}`).value;
    await apiPut(`/products/${id}`, { stock: Number(val) });
    loadAdmin();
}

function logout() {
    localStorage.clear();
    location.href = "index.html";
}

loadAdmin();

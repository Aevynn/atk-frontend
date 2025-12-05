const BASE_URL = "https://railway-your-backend-url.up.railway.app";

// ---------------- LOGIN ---------------- //
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    let data = await res.json();

    if (!data.success) {
        document.getElementById("msg").innerText = "Login gagal!";
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "user.html";
    }
}

// ---------------- LOGOUT ---------------- //
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ---------------- USER DASHBOARD ---------------- //
if (window.location.pathname.includes("user.html")) {
    loadProducts();
    renderCart();
}

let cart = [];

async function loadProducts() {
    let res = await fetch(`${BASE_URL}/products`);
    let data = await res.json();

    let box = document.getElementById("products");
    box.innerHTML = "";

    data.forEach(p => {
        box.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <p>Rp ${p.price}</p>
                <button onclick="addToCart(${p.id})">Tambah</button>
            </div>
        `;
    });
}

function addToCart(id) {
    let item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({id, qty: 1});

    renderCart();
}

function renderCart() {
    let box = document.getElementById("cart-items");
    if (!box) return;

    box.innerHTML = "";

    cart.forEach(i => {
        box.innerHTML += `
            <p>Produk ID: ${i.id} — Qty: ${i.qty}</p>
        `;
    });
}

async function checkout() {
    let user = JSON.parse(localStorage.getItem("user"));

    await fetch(`${BASE_URL}/transaction/checkout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId: user.id, cart})
    });

    alert("Checkout berhasil!");
    cart = [];
    renderCart();
}

// ---------------- ADMIN PAGE ---------------- //
if (window.location.pathname.includes("admin.html")) {
    loadAdmin();
}

async function loadAdmin() {
    let res = await fetch(`${BASE_URL}/products`);
    let products = await res.json();

    document.getElementById("admin-products").innerHTML =
        products.map(p => `<p>${p.name} — Stok: ${p.stock}</p>`).join("");

    let income = await fetch(`${BASE_URL}/transaction/income`);
    let total = await income.json();

    document.getElementById("income").innerText = "Rp " + total.totalIncome;
}

let cart = [];

async function loadProducts() {
    const res = await fetch(API + "/products");
    const products = await res.json();

    const box = document.getElementById("product-list");
    box.innerHTML = "";

    products.forEach(p => {
        box.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <p>Rp ${p.price}</p>
                <p>Stok: ${p.stock}</p>
                <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Tambah</button>
            </div>
        `;
    });
}

function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, price, qty: 1 });

    renderCart();
}

function renderCart() {
    const c = document.getElementById("cart");
    c.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        c.innerHTML += `<p>${item.name} x ${item.qty}</p>`;
    });

    document.getElementById("total").innerText = "Total: Rp " + total;
}

async function checkout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Login dulu");

    const res = await fetch(API + "/checkout", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ userId: user.id, cart })
    });

    const data = await res.json();

    if (data.success) {
        alert("Pembelian berhasil!");
        cart = [];
        renderCart();
        loadProducts();
    } else {
        alert(data.message);
    }
}

loadProducts();

// Cart page: render cart and do checkout
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  if (!user) { alert("Login dulu"); window.location = "login.html"; return; }
  renderCart();
});

async function renderCart(){
  const cart = JSON.parse(localStorage.getItem("atk_cart") || "[]");
  const products = await apiGet("/products");
  const box = document.getElementById("cartList");
  box.innerHTML = "";
  let total=0;
  cart.forEach(i=>{
    const p = products.find(x=>x.id===i.id);
    if(!p) return;
    total += p.price * i.qty;
    const el = document.createElement("div");
    el.className = "bg-white p-4 rounded shadow flex justify-between items-center";
    el.innerHTML = `<div><div class="font-semibold">${p.name}</div><div class="text-sm text-gray-600">Rp ${p.price} x ${i.qty}</div></div>
      <div class="flex gap-2">
        <button class="px-2 py-1 border rounded" onclick="changeQty(${i.id}, -1)">-</button>
        <button class="px-2 py-1 border rounded" onclick="changeQty(${i.id}, 1)">+</button>
      </div>`;
    box.appendChild(el);
  });
  document.getElementById("cartTotal").textContent = total;
}

function changeQty(id, delta){
  let cart = JSON.parse(localStorage.getItem("atk_cart") || "[]");
  const idx = cart.findIndex(i=>i.id===id);
  if(idx===-1) return;
  cart[idx].qty += delta;
  if(cart[idx].qty<=0) cart.splice(idx,1);
  localStorage.setItem("atk_cart", JSON.stringify(cart));
  renderCart();
}

async function doCheckout(){
  const cart = JSON.parse(localStorage.getItem("atk_cart") || "[]");
  if(cart.length===0) return alert("Keranjang kosong");
  const user = JSON.parse(localStorage.getItem("atk_user") || "null");
  const res = await apiPost("/cart/checkout", { username: user.username, cart });
  if (res && res.orderID) {
    alert("Order sukses. ID: " + res.orderID);
    localStorage.removeItem("atk_cart");
    window.location = "shop.html";
  } else {
    alert(res.message || "Checkout gagal");
  }
}

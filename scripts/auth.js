async function doLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  msg.textContent = "";

  if (!username || !password) { msg.textContent = "Masukkan username & password"; return; }

  const res = await apiPost("/auth/login", { username, password });

  if (!res || !res.success) {
    msg.textContent = (res && res.message) ? res.message : "Login gagal";
    return;
  }

  // store user minimal
  localStorage.setItem("atk_user", JSON.stringify(res.user));

  if (res.user.role === "admin") window.location.href = "admin.html";
  else window.location.href = "shop.html";
}

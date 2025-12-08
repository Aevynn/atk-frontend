// Login form handling
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const err = document.getElementById("loginError");
  err.classList.add("hidden"); err.textContent = "";

  if (!user || !pass) { err.textContent = "Isi username & password"; err.classList.remove("hidden"); return; }

  try {
    const res = await apiPost("/auth/login", { username: user, password: pass });
    if (!res || !res.message && !res.success && !res.user) {
      // older backend returns success:true + user or returns 200 with user — handle both
    }
    if (res?.role || res?.user) {
      // support both shapes
      const u = res.user || { username: res.username, role: res.role };
      localStorage.setItem("atk_user", JSON.stringify(u));
      if (u.role === "admin") window.location = "admin.html";
      else window.location = "shop.html";
    } else {
      // maybe error in body
      err.textContent = res.message || "Username atau password salah";
      err.classList.remove("hidden");
    }
  } catch (errx) {
    err.textContent = "Gagal menghubungi server";
    err.classList.remove("hidden");
  }
});

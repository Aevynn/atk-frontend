// REGISTER
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const errorBox = document.getElementById("regError");

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || "Registrasi gagal.";
      errorBox.classList.remove("hidden");
      return;
    }

    // Registrasi berhasil → pindah ke login
    window.location.href = "login.html";

  } catch (err) {
    errorBox.textContent = "Terjadi kesalahan server.";
    errorBox.classList.remove("hidden");
  }
});

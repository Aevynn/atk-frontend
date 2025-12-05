const API = "https://atk-backend2-production-0509.up.railway.app";

document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.success) {
    document.getElementById("msg").innerText = "Login gagal!";
    return;
  }

  localStorage.setItem("atk_user", JSON.stringify({
    username: data.username,
    role: data.role
  }));

  window.location.href = "index.html";
};

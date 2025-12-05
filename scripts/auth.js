async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
        document.getElementById("msg").innerText = "Login gagal";
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin") {
        window.location = "admin.html";
    } else {
        window.location = "user.html";
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location = "index.html";
}

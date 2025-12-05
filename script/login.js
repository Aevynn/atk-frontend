async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const res = await apiPost("/auth/login", { username, password, role });

    if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", role);

        if (role === "admin") location.href = "admin.html";
        else location.href = "shop.html";
    } else {
        document.getElementById("msg").innerText = res.message;
    }
}

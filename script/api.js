const BASE_URL = "https://atk-backend2-production-0509.up.railway.app";

async function apiGet(path) {
    const res = await fetch(BASE_URL + path);
    return await res.json();
}

async function apiPost(path, data) {
    const res = await fetch(BASE_URL + path, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return await res.json();
}

async function apiPut(path, data) {
    const res = await fetch(BASE_URL + path, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return await res.json();
}

// Central API config
const API_BASE = "https://atk-backend2-production-0509.up.railway.app";

// Helper: ambil token jika ada
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": "Bearer " + token } : {};
}

// GET
async function apiGet(path) {
  const res = await fetch(API_BASE + path, {
    headers: {
      ...authHeader()
    }
  });
  return await res.json();
}

// POST (umum)
async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// PUT (update penuh)
async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// PATCH (update sebagian)
async function apiPatch(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// DELETE
async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: 'DELETE',
    headers: {
      ...authHeader()
    }
  });
  return await res.json();
}

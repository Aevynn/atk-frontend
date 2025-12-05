// API layer — change API_BASE if your backend URL is different
const API_BASE = "https://atk-backend2-production-0509.up.railway.app";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  return res.json();
}
async function apiPost(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
}

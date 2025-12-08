// central API config + helpers
const API_BASE = "https://atk-backend2-production-0509.up.railway.app";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  return await res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

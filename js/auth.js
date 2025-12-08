// js/auth.js
// central auth helpers and login/register handlers (uses api.js)

function getUser() {
  try { return JSON.parse(localStorage.getItem('atk_user')); } catch { return null; }
}
function setUser(u) { localStorage.setItem('atk_user', JSON.stringify(u)); }
function removeUser() { localStorage.removeItem('atk_user'); }

// logout (exposed globally)
function logout() {
  removeUser();
  localStorage.removeItem('atk_cart');
  window.location.href = 'index.html';
}
window.logout = logout;

// helper to show/hide form errors (element must exist)
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg || '';
  el.classList.toggle('hidden', !msg);
}

// ---------- Login handler (login.html) ----------
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('loginError', '');

  const username = document.getElementById('username')?.value?.trim();
  const password = document.getElementById('password')?.value?.trim();
  if (!username || !password) { showError('loginError','Isi username & password'); return; }

  try {
    const res = await apiPost('/auth/login', { username, password });
    if (!res || res.success !== true) {
      showError('loginError', res?.message || 'Login gagal');
      return;
    }

    // save user and redirect by role
    setUser(res.user);
    if (res.user.role === 'admin') window.location.href = 'admin.html';
    else window.location.href = 'shop.html';
  } catch (err) {
    console.error(err);
    showError('loginError','Kesalahan jaringan');
  }
});

// ---------- Register handler (register.html) ----------
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('regError', '');

  const username = document.getElementById('regUsername')?.value?.trim();
  const password = document.getElementById('regPassword')?.value?.trim();
  if (!username || !password) { showError('regError','Isi username & password'); return; }

  try {
    const res = await apiPost('/auth/register', { username, password });
    if (!res || res.success !== true) {
      showError('regError', res?.message || 'Registrasi gagal');
      return;
    }
    alert('Registrasi berhasil — silakan login');
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
    showError('regError','Kesalahan jaringan');
  }
});

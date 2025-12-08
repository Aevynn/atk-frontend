// js/auth.js
// Dependensi: harus load js/api.js sebelum file ini (login.html already does that)

// helper: show error under form
function showFormError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg || '';
  if (msg) el.classList.remove('hidden'); else el.classList.add('hidden');
}

// LOGIN handler for login.html
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showFormError('loginError', '');

  const username = document.getElementById('username')?.value?.trim();
  const password = document.getElementById('password')?.value?.trim();

  if (!username || !password) {
    showFormError('loginError', 'Isi username dan password.');
    return;
  }

  try {
    // IMPORTANT: backend uses /auth/login
    const res = await apiPost('/auth/login', { username, password });

    // Expecting: { success: true, user: { id, username, role } }  (server.js provides that)
    if (!res || res.success !== true) {
      showFormError('loginError', res?.message || 'Login gagal. Periksa kredensial.');
      return;
    }

    // Save user for entire frontend to read (shop.js, cart.js, admin.js expect this)
    localStorage.setItem('atk_user', JSON.stringify(res.user));

    // Redirect based on role
    if (res.user.role === 'admin') window.location.href = 'admin.html';
    else window.location.href = 'shop.html';
  } catch (err) {
    console.error('Login error', err);
    showFormError('loginError', 'Terjadi kesalahan jaringan.');
  }
});

// REGISTER handler for register.html
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showFormError('regError', '');

  const username = document.getElementById('regUsername')?.value?.trim();
  const password = document.getElementById('regPassword')?.value?.trim();

  if (!username || !password) {
    showFormError('regError', 'Isi username dan password.');
    return;
  }

  try {
    const res = await apiPost('/auth/register', { username, password });

    if (!res || res.success !== true) {
      showFormError('regError', res?.message || 'Registrasi gagal.');
      return;
    }

    // sukses -> direct to login
    alert('Registrasi berhasil. Silakan login.');
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Register error', err);
    showFormError('regError', 'Terjadi kesalahan jaringan.');
  }
});

// Universal logout function used across pages
function logout() {
  localStorage.removeItem('atk_user');
  localStorage.removeItem('atk_cart'); // optional cleanup
  window.location.href = 'index.html';
}

// expose logout globally (so HTML can call onclick="logout()")
window.logout = logout;

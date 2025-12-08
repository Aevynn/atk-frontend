// auth.js - login & register handling using api.js helpers
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const err = document.getElementById('loginError');
  err.classList.add('hidden');

  const res = await apiPost('/auth/login', { username, password });
  if (!res || !res.success) {
    err.textContent = res?.message || 'Login failed';
    err.classList.remove('hidden');
    return;
  }

  localStorage.setItem('atk_user', JSON.stringify(res.user));
  if (res.user.role === 'admin') window.location = 'admin.html';
  else window.location = 'shop.html';
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const res = await apiPost('/auth/register', { username, password });
  if (!res || !res.success) {
    document.getElementById('regError').classList.remove('hidden');
    return;
  }
  alert('Register success, please login');
  window.location = 'login.html';
});

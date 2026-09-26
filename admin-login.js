/* admin-login.js
  Handles admin/author login, validates credentials, and sets session scope */

function renderDemoAccounts() {
  const author = cbGetAuthor();
  const admins = cbGetAdmins();
  const rows = [
    { label: 'Author', email: author.email, password: author.password },
    ...admins.map(a => ({ label: a.university + ' Admin', email: a.email, password: a.password })),
  ];
  document.getElementById('demoAccountList').innerHTML = rows.map(r => `
    <div class="demo-row">
      <span><strong>${r.label}</strong><br><span class="mono">${r.email}</span></span>
      <button type="button" data-email="${r.email}" data-password="${r.password}">Use this</button>
    </div>
  `).join('');
  document.querySelectorAll('[data-email]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('loginEmail').value = btn.dataset.email;
      document.getElementById('loginPassword').value = btn.dataset.password;
    });
  });
}
renderDemoAccounts();
function setInvalid(fieldId, invalid) {
  document.getElementById(fieldId).classList.toggle('invalid', invalid);
}
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('loginError').classList.remove('show');
  setInvalid('f-email', false);
  setInvalid('f-password', false);
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  if (!email) { setInvalid('f-email', true); return; }
  if (!password) { setInvalid('f-password', true); return; }
  const author = cbGetAuthor();
  if (author.email.toLowerCase() === email && author.password === password) {
    cbSetSession({ role: 'author', name: author.name, email: author.email });
    window.location.href = 'author-dashboard.html';
    return;
  }
  const admin = cbGetAdmins().find(a => a.email.toLowerCase() === email);
  if (admin && admin.password === password) {
    cbSetSession({ role: 'admin', name: admin.name, email: admin.email, university: admin.university });
    window.location.href = 'admin-dashboard.html';
    return;
  }
  document.getElementById('loginError').classList.add('show');
});

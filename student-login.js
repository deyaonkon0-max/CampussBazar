/*student-login.js*/

function renderDemoAccounts() {
  const verifications = cbGetVerifications();
  const sample = [
    verifications.find(v => v.email === 'rafi@puc.edu.bd'),
    verifications.find(v => v.email === 'farzana@cu.edu.bd'),
    verifications.find(v => v.status === 'pending'),
  ].filter(Boolean);
  document.getElementById('demoAccountList').innerHTML = sample.map(v => `
    <div class="demo-row">
      <span><strong>${v.name}</strong> ${v.status === 'pending' ? '(pending — try this to see that message)' : ''}<br><span class="mono">${v.email}</span></span>
      <button type="button" data-email="${v.email}" data-password="${v.password}">Use this</button>
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
function hideAllMessages() {
  ['notFoundError', 'pendingError', 'rejectedError'].forEach(id => document.getElementById(id).classList.remove('show'));
}
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  hideAllMessages();
  setInvalid('f-email', false);
  setInvalid('f-password', false);
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  if (!email) { setInvalid('f-email', true); return; }
  if (!password) { setInvalid('f-password', true); return; }
  const record = cbFindVerificationByEmail(email);
  if (!record) {
    document.getElementById('notFoundError').classList.add('show');
    return;
  }
  if (record.status === 'pending') {
    document.getElementById('pendingError').classList.add('show');
    return;
  }
  if (record.status === 'rejected') {
    document.getElementById('rejectedError').classList.add('show');
    return;
  }
  // status 
  if (record.password !== password) {
    setInvalid('f-password', true);
    return;
  }
  cbSetSession({
    role: 'student',
    name: record.name,
    email: record.email,
    university: record.university,
    studentId: record.studentId,
  });
  window.location.href = 'dashboard.html';
});

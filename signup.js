/* signup.js*/

const uniSelect = document.getElementById('uniInput');
UNIVERSITIES.forEach(u => {
  const opt = document.createElement('option');
  opt.value = u; opt.textContent = u;
  uniSelect.appendChild(opt);
});
document.getElementById('idCardInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('idCardImg').src = ev.target.result;
    document.getElementById('idCardName').textContent = file.name;
    document.getElementById('idCardPreview').style.display = 'flex';
  };
  reader.readAsDataURL(file);
});
function setInvalid(fieldId, invalid) {
  document.getElementById(fieldId).classList.toggle('invalid', invalid);
}
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validateSignup() {
  let valid = true;
  const name = document.getElementById('nameInput').value.trim();
  const sid = document.getElementById('sidInput').value.trim();
  const uni = uniSelect.value;
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  setInvalid('f-name', !name); if (!name) valid = false;
  setInvalid('f-sid', !sid); if (!sid) valid = false;
  setInvalid('f-uni', !uni); if (!uni) valid = false;
  const emailInvalid = !isValidEmail(email);
  setInvalid('f-email', emailInvalid); if (emailInvalid) valid = false;
  const passwordInvalid = password.length < 4;
  setInvalid('f-password', passwordInvalid); if (passwordInvalid) valid = false;
  return valid;
}
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('alreadyPendingNote').style.display = 'none';
  if (!validateSignup()) return;
  const email = document.getElementById('emailInput').value.trim();
  if (cbFindVerificationByEmail(email)) {
    document.getElementById('alreadyPendingNote').style.display = 'flex';
    return;
  }
  cbAddVerification({
    name: document.getElementById('nameInput').value.trim(),
    studentId: document.getElementById('sidInput').value.trim(),
    university: uniSelect.value,
    email: email,
    phone: document.getElementById('phoneInput').value.trim(),
    password: document.getElementById('passwordInput').value,
    idCardName: document.getElementById('idCardName').textContent || 'not uploaded',
  });
  document.getElementById('signupForm').reset();
  document.getElementById('idCardPreview').style.display = 'none';
  document.getElementById('signupToast').classList.add('show');
});

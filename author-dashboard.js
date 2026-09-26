/* ====author-dashboard.js*/

const session = cbGetSession();

if(!session || session.role !== 'author'){
  window.location.href = 'admin-login.html';
} else {
  document.getElementById('gateWrap').style.display = 'none';
  document.getElementById('dashWrap').style.display = 'block';
  document.getElementById('authorNameLabel').textContent = 'Logged in as ' + session.name + ' (' + session.email + ')';

  document.getElementById('logoutBtn').addEventListener('click', () => {
    cbClearSession();
    window.location.href = 'admin-login.html';
  });
  const uniSelect = document.getElementById('uniSelect');
  UNIVERSITIES.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u; opt.textContent = u;
    uniSelect.appendChild(opt);
  });
  function renderAdmins(){
    const admins = cbGetAdmins();
    document.getElementById('adminsWrap').innerHTML = UNIVERSITIES.map(u => {
      const a = admins.find(x => x.university === u);
      return `
      <div class="admin-list-row">
        <div>
          <div style="font-weight:700;">${u}</div>
          <div class="small-muted mono">${a ? a.name + ' · ' + a.email : 'No admin assigned yet'}</div>
        </div>
        <button class="btn btn-sm btn-outline" data-preload="${u}">Edit</button>
      </div>`;
    }).join('');
    document.querySelectorAll('[data-preload]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.dataset.preload;
        const a = cbGetAdmins().find(x => x.university === u);
        uniSelect.value = u;
        document.getElementById('newAdminName').value = a ? a.name : '';
        document.getElementById('newAdminEmail').value = a ? a.email : '';
        document.getElementById('newAdminPassword').value = a ? a.password : 'admin123';
        window.scrollTo({top: document.getElementById('reassignForm').offsetTop - 100, behavior: 'smooth'});
      });
    });
  }
  renderAdmins();
  document.getElementById('reassignForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const university = uniSelect.value;
    const name = document.getElementById('newAdminName').value.trim();
    const email = document.getElementById('newAdminEmail').value.trim();
    const password = document.getElementById('newAdminPassword').value.trim();
    if(!name || !email || !password) return;
    cbSetAdminForUniversity(university, name, email, password);
    renderAdmins();
    document.getElementById('reassignToast').classList.add('show');
    setTimeout(() => document.getElementById('reassignToast').classList.remove('show'), 3000);
  });
}

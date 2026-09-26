/* admin-dashboard.js*/

const session = cbGetSession();

if (!session || session.role !== 'admin') {
  window.location.href = 'admin-login.html';
} else {
  document.getElementById('gateWrap').style.display = 'none';
  document.getElementById('dashWrap').style.display = 'block';
  document.getElementById('adminUniLabel').textContent = session.university + ' Admin';
  document.getElementById('adminNameLabel').textContent = 'Logged in as ' + session.name + ' (' + session.email + ')';
  document.getElementById('logoutBtn').addEventListener('click', () => {
    cbClearSession();
    window.location.href = 'admin-login.html';
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
  function rowHtml(v, showActions) {
    return `
    <div class="verify-row">
      <div class="verify-row-left">
        <div class="avatar">${v.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <div style="font-weight:700;">${v.name}</div>
          <div class="verify-meta mono">${v.studentId} · ${v.email}</div>
          <div class="verify-meta">ID card: ${v.idCardName} · Submitted ${v.days}d ago</div>
        </div>
      </div>
      <div class="dash-actions">
        ${showActions ? `
          <button class="btn btn-sm btn-primary" data-approve="${v.id}">Approve</button>
          <button class="btn btn-sm btn-danger-outline" data-reject="${v.id}">Reject</button>
        ` : `<span class="status-badge status-${v.status}">${v.status.toUpperCase()}</span>`}
      </div>
    </div>`;
  }
  function render() {
    const mine = cbGetVerifications().filter(v => v.university === session.university);
    const pending = mine.filter(v => v.status === 'pending');
    const verified = mine.filter(v => v.status === 'verified');
    const rejected = mine.filter(v => v.status === 'rejected');
    document.getElementById('pendingCountBadge').innerHTML = pending.length
      ? `<span class="count-badge">${pending.length}</span>` : '';
    const banner = document.getElementById('newRequestBanner');
    if (pending.length) {
      banner.classList.add('show');
      banner.innerHTML = `🔔 ${pending.length} student${pending.length === 1 ? '' : 's'} waiting on your review for ${session.university} — see the Pending tab below.`;
    } else {
      banner.classList.remove('show');
    }
    document.getElementById('pendingWrap').innerHTML = pending.length
      ? pending.map(v => rowHtml(v, true)).join('')
      : '<div class="empty-state">No pending requests for ' + session.university + ' right now.</div>';
    document.getElementById('verifiedWrap').innerHTML = verified.length
      ? verified.map(v => rowHtml(v, false)).join('')
      : '<div class="empty-state">No verified students yet.</div>';
    document.getElementById('rejectedWrap').innerHTML = rejected.length
      ? rejected.map(v => rowHtml(v, false)).join('')
      : '<div class="empty-state">Nothing rejected.</div>';

    document.querySelectorAll('[data-approve]').forEach(btn => {
      btn.addEventListener('click', () => {
        cbUpdateVerification(parseInt(btn.dataset.approve, 10), { status: 'verified' });
        render();
      });
    });
    document.querySelectorAll('[data-reject]').forEach(btn => {
      btn.addEventListener('click', () => {
        cbUpdateVerification(parseInt(btn.dataset.reject, 10), { status: 'rejected' });
        render();
      });
    });
  }
  render();
}
const session = cbGetSession();

if(!session || session.role !== 'student'){
  window.location.href = 'student-login.html';
} else {
document.getElementById('gateWrap').style.display = 'none';
document.getElementById('dashWrap').style.display = 'block';
document.getElementById('studentUniLabel').textContent = session.university;
document.getElementById('studentNameLabel').textContent = 'Logged in as ' + session.name + ' (' + session.email + ')';
document.getElementById('logoutBtn').addEventListener('click', () => {
cbClearSession();
window.location.href = 'index.html';
});
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
btn.classList.add('active');
document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
});
});
function renderMyListings(){
const mine = cbGetListings().filter(l => l.sellerEmail.toLowerCase() === session.email.toLowerCase());
const el = document.getElementById('dashListingsWrap');
if(!mine.length){
el.innerHTML = '<div class="empty-state">You haven\'t posted anything yet. <a href="post-listing.html">Post your first listing</a>.</div>';
return;
}
 el.innerHTML = mine.map(l => `
<div class="dash-row">
<div class="dash-row-left">
<div class="dash-thumb">${cbThumbHtml(l)}</div>
<div>
<div style="font-weight:700;">${l.title}</div>
<div class="small-muted mono">${l.mode === 'exchange' ? 'Looking for: ' + l.lookingFor : '৳' + l.price.toLocaleString()}</div>
</div>
</div>
<div class="dash-actions">
<span class="status-badge ${l.status==='active'?'status-active':'status-sold'}">${l.status.toUpperCase()}</span>
${l.status==='active' ? `<button class="btn btn-sm btn-danger-outline" data-sold="${l.id}">Mark as Sold</button>` : ''}
<a href="item-details.html?id=${l.id}" class="btn btn-sm btn-ghost">View</a>
</div>
</div>
`).join('');
el.querySelectorAll('[data-sold]').forEach(btn => {
btn.addEventListener('click', () => {
cbUpdateListing(parseInt(btn.dataset.sold, 10), { status: 'sold' });
renderMyListings();
});
});
}
  renderMyListings();
}
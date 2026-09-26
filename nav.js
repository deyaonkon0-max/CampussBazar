function cbRenderHeader(){
  const active = window.CB_ACTIVE_PAGE || '';
  const header = document.getElementById('site-header');
  if(!header) return;
  const session = cbGetSession();
  const isStudent = session && session.role === 'student';
  header.innerHTML = `
    <div class="wrap nav-inner">
      <a href="index.html" class="logo"><span class="logo-mark"></span>CampusBazaar</a>
      <div class="nav-search">
        <form id="navSearchForm">
          <button type="submit" class="icon" aria-label="Search">🔍</button>
          <input type="text" id="navSearchInput" placeholder="Search everything…">
        </form>
      </div>
      <nav class="nav-links" id="navLinks">
        <a href="index.html" class="${active==='home'?'active':''}">Home</a>
        <a href="marketplace.html" class="${active==='marketplace'?'active':''}">Marketplace</a>
        <a href="books.html" class="${active==='books'?'active':''}">Books &amp; Accessories</a>
        <a href="about.html" class="${active==='about'?'active':''}">About</a>
        <a href="dashboard.html" class="${active==='dashboard'?'active':''}">Dashboard</a>
        <a href="post-listing.html" class="btn btn-outline btn-sm" style="margin-top:6px;">Post a Listing</a>
        ${isStudent
          ? `<a href="dashboard.html" class="btn btn-primary btn-sm" style="margin-top:6px;">${session.name.split(' ')[0]}</a>`
          : `<a href="student-login.html" class="btn btn-ghost btn-sm" style="margin-top:6px;">Log In</a>
             <a href="signup.html" class="btn btn-primary btn-sm" style="margin-top:6px;">Sign Up</a>`
        }
      </nav>
      <div class="nav-actions">
        <a href="post-listing.html" class="btn btn-outline btn-sm">Post a Listing</a>
        ${isStudent
          ? `<a href="dashboard.html" class="btn btn-primary btn-sm">${session.name.split(' ')[0]}</a>`
          : `<a href="student-login.html" class="btn btn-ghost btn-sm">Log In</a>
             <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>`
        }
        <button class="hamburger" id="hamburgerBtn" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  `;
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  hamburgerBtn.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
  document.getElementById('navSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('navSearchInput').value.trim();
    if(q){
      window.location.href = 'search-results.html?q=' + encodeURIComponent(q);
    }
  });
}

function cbRenderFooter(){
  const footer = document.getElementById('site-footer');
  if(!footer) return;
  footer.innerHTML = `
    <div class="wrap footer-inner">
      <div class="footer-links">
        <a href="index.html">Home</a>
        <a href="marketplace.html">Marketplace</a>
        <a href="books.html">Books &amp; Accessories</a>
        <a href="about.html">About</a>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <div class="footer-note">CampusBazaar· Premier University</div>
        <div style="display:flex;gap:12px;">
          <a href="student-login.html" class="footer-admin-link">Student Login</a>
          <a href="admin-login.html" class="footer-admin-link">Admin / Author Login</a>
        </div>
      </div>
    </div>
  `;
}
function cbRenderProtocolWarning(){
  if(window.location.protocol !== 'file:') return;
  const banner = document.createElement('div');
  banner.className = 'file-protocol-banner';
  banner.innerHTML = 'You opened this file directly, so the site cannot load or save its data (db.json). Run <code>python3 serve.py</code> in this folder and open <code>http://localhost:8000</code> instead.';
  document.body.insertBefore(banner, document.body.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
  cbRenderProtocolWarning();
  cbRenderHeader();
  cbRenderFooter();
});

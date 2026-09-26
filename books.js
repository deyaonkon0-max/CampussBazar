let bookState = {university:'all', search:''};

function renderBookPills(){
  const books = cbGetListings().filter(i => i.section === 'book' && i.status !== 'sold');
  const unis = ['all', ...new Set(books.map(b => b.university))];
  const el = document.getElementById('bookUniPills');
  el.innerHTML = unis.map(u =>
    `<button class="pill ${bookState.university===u?'active':''}" data-uni="${u}">${u==='all'?'All Universities':u}</button>`
  ).join('');
  el.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      bookState.university = p.dataset.uni;
      renderBookPills();
      applyBookFilter();
    });
  });
}
function applyBookFilter(){
  let items = cbGetListings().filter(i => i.section === 'book' && i.status !== 'sold');
  if(bookState.university !== 'all'){
    items = items.filter(i => i.university === bookState.university);
  }
  if(bookState.search.trim()){
    const q = bookState.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.course.toLowerCase().includes(q));
  }
  cbRenderGrid('bookGrid', items, 'No listings match your filters yet.');
}
document.getElementById('bookSearch').addEventListener('input', (e) => {
  bookState.search = e.target.value;
  applyBookFilter();
});
renderBookPills();
applyBookFilter();

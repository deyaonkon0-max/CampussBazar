function runSearch(query){
  const q = query.trim().toLowerCase();
  document.getElementById('searchPageInput').value = query;
  document.getElementById('searchHeading').textContent = query ? `Results for "${query}"` : 'Search Results';
  if(!q){
    document.getElementById('searchSubheading').textContent = 'Type something to search across the whole marketplace.';
    cbRenderGrid('searchGrid', [], 'Nothing to show yet — try a search above.');
    return;
  }
  const results = cbGetListings().filter(i =>
    i.status !== 'sold' && (
      i.title.toLowerCase().includes(q) ||
      (i.desc && i.desc.toLowerCase().includes(q)) ||
      (i.course && i.course.toLowerCase().includes(q)) ||
      (i.university && i.university.toLowerCase().includes(q))
    )
  );
  document.getElementById('searchSubheading').textContent = `${results.length} listing${results.length === 1 ? '' : 's'} found across Marketplace and Books.`;
  cbRenderGrid('searchGrid', results, `No listings match "${query}".`);
}
document.getElementById('searchPageInput').addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    const q = e.target.value.trim();
    window.history.replaceState(null, '', 'search-results.html?q=' + encodeURIComponent(q));
    runSearch(q);
  }
});
const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
runSearch(initialQuery);

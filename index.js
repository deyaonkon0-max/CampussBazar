document.addEventListener('DOMContentLoaded', () => {
  const featured = cbGetListings().filter(i => i.status !== 'sold').slice(0, 3);
  cbRenderGrid('homeFeaturedGrid', featured, 'No listings yet — be the first to post one.');
});

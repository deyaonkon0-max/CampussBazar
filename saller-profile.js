const sellerEmail = new URLSearchParams(window.location.search).get('seller') || '';
const sellerListings = cbGetListings().filter(i => i.sellerEmail === sellerEmail);
const sellerName = sellerListings.length ? sellerListings[0].sellerName : 'Unknown Seller';

document.getElementById('profileAvatar').textContent = sellerName.split(' ').map(n => n[0]).join('');
document.getElementById('profileName').textContent = sellerName;
document.getElementById('profileMeta').textContent = sellerEmail + ' · Member of CampusBazaar';
cbRenderGrid('profileListingsGrid', sellerListings.filter(i => i.status !== 'sold'), 'No active listings from this seller.');
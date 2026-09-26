const params = new URLSearchParams(window.location.search);
const itemId = parseInt(params.get('id'), 10);
const item = cbGetListingById(itemId);
if(!item){
  document.getElementById('detailsContent').style.display = 'none';
  document.getElementById('notFoundState').style.display = 'block';
} else {
  document.getElementById('detailsContent').style.display = 'grid';
  document.getElementById('detailThumb').innerHTML = cbThumbHtml(item);
  document.getElementById('detailTags').innerHTML = cbTagsHtml(item);
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailPrice').innerHTML = cbPriceHtml(item);
  document.getElementById('detailDesc').textContent = item.desc;
  document.getElementById('detailMeta').textContent = item.section === 'book'
    ? `${item.university} · ${item.course} · ${item.edition} · Posted ${item.days}d ago`
    : `${item.campus} · Condition: ${item.condition} · Posted ${item.days}d ago`;
  const initials = item.sellerName.split(' ').map(n => n[0]).join('');
  document.getElementById('detailAvatar').textContent = initials;
  const sellerLink = document.getElementById('detailSellerLink');
  sellerLink.textContent = item.sellerName;
  sellerLink.href = 'seller-profile.html?seller=' + encodeURIComponent(item.sellerEmail);
  document.getElementById('viewProfileLink').href = 'seller-profile.html?seller=' + encodeURIComponent(item.sellerEmail);
  document.getElementById('detailSellerEmail').textContent = item.sellerEmail;
  document.getElementById('contactEmail').textContent = item.sellerEmail;
  document.getElementById('chatSellerName').textContent = item.sellerName;
  document.getElementById('proposeExchangeBtn').style.display = item.mode === 'exchange' ? 'inline-flex' : 'none';
  document.getElementById('contactSellerBtn').addEventListener('click', () => {
    document.getElementById('contactReveal').classList.toggle('show');
  });
  document.getElementById('proposeExchangeBtn').addEventListener('click', () => {
    document.getElementById('exchangeToast').classList.add('show');
  });
  document.getElementById('chatFab').addEventListener('click', () => {
    document.getElementById('chatBox').classList.toggle('show');
  });
  document.getElementById('chatCloseBtn').addEventListener('click', () => {
    document.getElementById('chatBox').classList.remove('show');
  });
  const related = cbGetListings().filter(i => i.id !== item.id && i.section === item.section).slice(0, 3);
  cbRenderGrid('relatedGrid', related, 'No related listings yet.');
}
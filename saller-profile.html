function cbTagsHtml(item){
  let tags = item.mode === 'exchange' ? '<span class="tag exchange">Exchange</span>' : '<span class="tag">For Sale</span>';
  tags += `<span class="tag">${item.condition}</span>`;
  if(item.section === 'book') tags += `<span class="tag">${item.university}</span>`;
  if(item.status === 'sold') tags += '<span class="tag sold">Sold</span>';
  return tags;
}
function cbPriceHtml(item){
  return item.mode === 'exchange'
    ? `<span class="mono" style="color:var(--warning);">Looking for: ${item.lookingFor}</span>`
    : `<span class="mono">৳${item.price.toLocaleString()}</span>`;
}
function cbThumbHtml(item){
  return item.photo
    ? `<img src="${item.photo}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;">`
    : item.emoji;
}
function cbCardHtml(item){
  return `
  <a class="listing-card" href="item-details.html?id=${item.id}">
    <div class="listing-thumb">${cbThumbHtml(item)}</div>
    <div class="listing-body">
      <div class="listing-tags">${cbTagsHtml(item)}</div>
      <div class="listing-title">${item.title}</div>
      <div class="listing-meta">${item.section === 'book' ? item.course + ' · ' + item.edition : item.campus + ' · ' + item.days + 'd ago'}</div>
      <div class="listing-price">${cbPriceHtml(item)}</div>
      <div class="listing-seller-row">${item.sellerName}</div>
    </div>
  </a>`;
}
function cbRenderGrid(containerId, items, emptyMessage){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = items.length
    ? items.map(cbCardHtml).join('')
    : `<div class="empty-state">${emptyMessage || 'No listings match your filters yet.'}</div>`;
}
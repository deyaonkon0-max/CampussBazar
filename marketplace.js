const marketCategories = ['all','electronics','furniture','clothing','stationery','bicycles','exchange'];
const marketLabels = {all:'All', electronics:'Electronics', furniture:'Furniture', clothing:'Clothing', stationery:'Stationery', bicycles:'Bicycles', exchange:'Exchange Only'};
let marketState = {category:'all', search:''};
function renderMarketPills(){
  const el = document.getElementById('marketCategoryPills');
  el.innerHTML = marketCategories.map(c =>
    `<button class="pill ${marketState.category===c?'active':''}" data-cat="${c}">${marketLabels[c]}</button>`
  ).join('');
  el.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      marketState.category = p.dataset.cat;
      renderMarketPills();
      applyMarketFilter();
    });
  });
}
function applyMarketFilter(){
  let items = cbGetListings().filter(i => i.section === 'market' && i.status !== 'sold');
  if(marketState.category === 'exchange'){
    items = items.filter(i => i.mode === 'exchange');
  } else if(marketState.category !== 'all'){
    items = items.filter(i => i.category === marketState.category);
  }
  if(marketState.search.trim()){
    const q = marketState.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q));
  }
  cbRenderGrid('marketGrid', items, 'No listings match your filters yet.');
}
document.getElementById('marketSearch').addEventListener('input', (e) => {
  marketState.search = e.target.value;
  applyMarketFilter();
});
renderMarketPills();
applyMarketFilter();
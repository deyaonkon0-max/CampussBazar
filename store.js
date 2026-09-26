const CB_COLLECTIONS = ['listings', 'admins', 'author', 'verifications'];
const CB_SESSION_KEY = 'cb_session';
let cbApiAvailable = null;
let cbStaticDb = null;
function cbHttp(method, url, body){
  try{
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    if(body !== undefined) xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    return xhr;
  }catch(e){ return null; }
}
function cbHasApi(){
  if(cbApiAvailable === null){
    const r = cbHttp('GET', 'api/listings');
    cbApiAvailable = !!(r && r.status === 200);
  }
  return cbApiAvailable;
}
function cbRead(name){
  if(cbHasApi()){
    const r = cbHttp('GET', 'api/' + name);
    if(r && r.status === 200) return JSON.parse(r.responseText);
  }
  const local = localStorage.getItem('cb_db_' + name);
  if(local !== null) return JSON.parse(local);
  if(cbStaticDb === null){
    const r = cbHttp('GET', 'db.json');
    cbStaticDb = (r && r.status === 200) ? JSON.parse(r.responseText) : {};
  }
  return cbStaticDb[name] !== undefined ? cbStaticDb[name] : (name === 'author' ? null : []);
}
function cbWrite(name, data){
  if(cbHasApi()){
    const r = cbHttp('PUT', 'api/' + name, JSON.stringify(data));
    if(r && r.status === 200) return;
  }
  localStorage.setItem('cb_db_' + name, JSON.stringify(data));
}
function cbNextId(arr){ return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

function cbGetListings(){ return cbRead('listings'); }
function cbSaveListings(arr){ cbWrite('listings', arr); }
function cbAddListing(item){
  const arr = cbGetListings();
  item.id = cbNextId(arr);
  item.status = item.status || 'active';
  item.days = 0;
  arr.unshift(item);
  cbSaveListings(arr);
  return item;
}
function cbUpdateListing(id, patch){
  const arr = cbGetListings();
  const i = arr.findIndex(x => x.id === id);
  if(i > -1){ arr[i] = Object.assign({}, arr[i], patch); cbSaveListings(arr); }
  return i > -1 ? arr[i] : null;
}
function cbGetListingById(id){ return cbGetListings().find(x => x.id === id) || null; }

function cbGetAdmins(){ return cbRead('admins'); }
function cbSaveAdmins(arr){ cbWrite('admins', arr); }
function cbGetAuthor(){ return cbRead('author'); }
function cbSetAdminForUniversity(university, name, email, password){
  const arr = cbGetAdmins();
  const i = arr.findIndex(a => a.university === university);
  const record = {id: i > -1 ? arr[i].id : cbNextId(arr), university, name, email, password};
  if(i > -1) arr[i] = record; else arr.push(record);
  cbSaveAdmins(arr);
  return record;
}

function cbGetVerifications(){ return cbRead('verifications'); }
function cbSaveVerifications(arr){ cbWrite('verifications', arr); }
function cbAddVerification(entry){
  const arr = cbGetVerifications();
  entry.id = cbNextId(arr);
  entry.days = 0;
  entry.status = 'pending';
  arr.unshift(entry);
  cbSaveVerifications(arr);
  return entry;
}
function cbUpdateVerification(id, patch){
  const arr = cbGetVerifications();
  const i = arr.findIndex(x => x.id === id);
  if(i > -1){ arr[i] = Object.assign({}, arr[i], patch); cbSaveVerifications(arr); }
  return i > -1 ? arr[i] : null;
}
function cbFindVerificationByEmail(email){
  return cbGetVerifications().find(v => v.email.toLowerCase() === email.toLowerCase()) || null;
}

function cbGetSession(){ return JSON.parse(localStorage.getItem(CB_SESSION_KEY) || 'null'); }
function cbSetSession(session){ localStorage.setItem(CB_SESSION_KEY, JSON.stringify(session)); }
function cbClearSession(){ localStorage.removeItem(CB_SESSION_KEY); }

function cbResetAllData(){
  if(cbHasApi()) cbHttp('POST', 'api/reset');
  CB_COLLECTIONS.forEach(n => localStorage.removeItem('cb_db_' + n));
  localStorage.removeItem(CB_SESSION_KEY);
}

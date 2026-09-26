const session = cbGetSession();

if(!session || session.role !== 'student'){
  document.getElementById('gateWrap').style.display = 'block';
  document.getElementById('formWrap').style.display = 'none';
} else {
  document.getElementById('gateWrap').style.display = 'none';
  document.getElementById('formWrap').style.display = 'block';
  document.getElementById('postAsLabel').textContent = session.name + ' (' + session.university + ')';

  const modeOptions = document.querySelectorAll('.mode-option');
  const listingTypeSelect = document.getElementById('listingType');
  const bookFieldsWrap = document.getElementById('bookFieldsWrap');
  const priceField = document.getElementById('f-price');
  const lookingForField = document.getElementById('f-lookingfor');
  let currentMode = 'sale';
  let uploadedPhotoData = null; // resized base64 JPEG, or null if no photo chosen

  listingTypeSelect.addEventListener('change', (e) => {
    bookFieldsWrap.style.display = e.target.value === 'book' ? 'block' : 'none';
  });
  modeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentMode = opt.dataset.mode;
      priceField.style.display = currentMode === 'exchange' ? 'none' : 'block';
      lookingForField.style.display = currentMode === 'exchange' ? 'block' : 'none';
    });
  });
  function resizeImage(dataUrl, maxDimension){
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if(width > height && width > maxDimension){
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else if(height > maxDimension){
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }
  document.getElementById('listingPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      uploadedPhotoData = await resizeImage(ev.target.result, 700);
      document.getElementById('listingPhotoImg').src = uploadedPhotoData || ev.target.result;
      document.getElementById('listingPhotoName').textContent = file.name;
      document.getElementById('listingPhotoPreview').style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });
  function setInvalid(fieldId, invalid){
    document.getElementById(fieldId).classList.toggle('invalid', invalid);
  }
  function validateForm(){
    let valid = true;
    const title = document.getElementById('titleInput').value.trim();
    setInvalid('f-title', !title);
    if(!title) valid = false;
    if(listingTypeSelect.value === 'book'){
      const uni = document.getElementById('universityInput').value.trim();
      const course = document.getElementById('courseInput').value.trim();
      setInvalid('f-university', !uni);
      setInvalid('f-course', !course);
      if(!uni) valid = false;
      if(!course) valid = false;
    } else {
      setInvalid('f-university', false);
      setInvalid('f-course', false);
    }
    if(currentMode === 'sale'){
      const price = parseFloat(document.getElementById('priceInput').value);
      const priceInvalid = !price || price <= 0;
      setInvalid('f-price', priceInvalid);
      if(priceInvalid) valid = false;
      setInvalid('f-lookingfor', false);
    } else {
      const lookingFor = document.getElementById('lookingForInput').value.trim();
      setInvalid('f-lookingfor', !lookingFor);
      if(!lookingFor) valid = false;
      setInvalid('f-price', false);
    }
    return valid;
  }
  const emojiByCategory = {
    electronics:'💻', furniture:'🪑', clothing:'🧥', stationery:'📐', bicycles:'🚲', book:'📘', default:'📦'
  };
  document.getElementById('postListingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    const type = listingTypeSelect.value;
    const isBook = type === 'book';
    const item = {
      section: isBook ? 'book' : 'market',
      title: document.getElementById('titleInput').value.trim(),
      condition: document.getElementById('conditionInput').value,
      mode: currentMode,
      desc: document.getElementById('descInput').value.trim() || 'No additional description provided.',
      sellerName: session.name,
      sellerEmail: session.email,
      emoji: isBook ? '📘' : emojiByCategory.default,
      photo: uploadedPhotoData || null,
    };
    if(isBook){
      item.university = document.getElementById('universityInput').value.trim();
      item.course = document.getElementById('courseInput').value.trim();
      item.edition = '—';
    } else {
      item.category = 'electronics';
      item.campus = session.university;
    }
    if(currentMode === 'sale'){
      item.price = parseFloat(document.getElementById('priceInput').value);
    } else {
      item.lookingFor = document.getElementById('lookingForInput').value.trim();
    }
    const saved = cbAddListing(item);
    document.getElementById('listingToast').classList.add('show');
    setTimeout(() => {
      window.location.href = 'item-details.html?id=' + saved.id;
    }, 1100);
  });
}
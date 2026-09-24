// ============================================================
//  AI Estate & Builders – Complete script.js
// ============================================================

const PASS = 'aiestate2025';
let authed = false;
let curFilt = 'All';
let pendingImages = []; // Temporary storage for uploaded images

const IMGS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'
];

const DEFAULTS = [
  {id:1,title:'Modern 5 Marla Corner House',location:'Central Park, Lahore',price:'1.2 Crore',size:'5 Marla',beds:3,baths:3,status:'For Sale',description:'A beautifully designed corner 5 Marla house in the heart of Central Park Housing Scheme. Built with premium materials and a modern layout perfect for a family of four. Ground plus one floor with spacious rooms, high ceilings, and excellent ventilation throughout.',features:['Marble Flooring','Modern Kitchen','Backup Generator','Rooftop Access','Guest Parking','CCTV Ready'],image:IMGS[0],images:[IMGS[0]]},
  {id:2,title:'Luxury 10 Marla Villa',location:'Central Park, Lahore',price:'2.8 Crore',size:'10 Marla',beds:5,baths:5,status:'For Sale',description:'An exquisite 10 Marla villa with premium finishes throughout. Grand entrance, formal lounge, separate dining, and a stunning kitchen. Landscaped garden and servant quarters included.',features:['Landscaped Garden','Servant Quarters','Smart Home Wiring','Marble Throughout','Double Garage','Solar Ready'],image:IMGS[1],images:[IMGS[1]]},
  {id:3,title:'Contemporary 5 Marla Home',location:'Central Park, Lahore',price:'1.05 Crore',size:'5 Marla',beds:3,baths:2,status:'Sold',description:'A modern and well-planned 5 Marla residential property featuring contemporary design with quality tile flooring, a well-equipped kitchen, and separate lounge and dining areas. Ready to move in condition.',features:['Tile Flooring','Modern Bathrooms','TV Lounge','Kitchen Cabinets','Boundary Wall','Main Boulevard'],image:IMGS[2],images:[IMGS[2]]},
  {id:4,title:'Premium 10 Marla House',location:'Central Park, Lahore',price:'2.5 Crore',size:'10 Marla',beds:4,baths:4,status:'For Sale',description:'A premium 10 Marla house with top-quality construction in a prime block of Central Park. Spacious bedrooms with attached baths, grand entrance porch, and rooftop with a beautiful view of the housing scheme.',features:['Attached Bathrooms','Entrance Porch','Rooftop Space','Underground Tank','Gas Connection','Electricity Backup'],image:IMGS[3],images:[IMGS[3]]},
  {id:5,title:'Elegant 5 Marla Family Home',location:'Central Park, Lahore',price:'1.15 Crore',size:'5 Marla',beds:3,baths:3,status:'For Sale',description:'A well-designed 5 Marla house ideal for a growing family. Located in a quiet street with easy access to the main gate and commercial area. Fully tiled, plastered, and ready for fitout.',features:['Corner Adjacent','Quiet Street','Near Commercial','Full Tile Work','Quality Plastering','Strong Structure'],image:IMGS[4],images:[IMGS[4]]}
];

// ===== DATA =====
function load() {
  const s = localStorage.getItem('aie_props');
  if (!s) {
    localStorage.setItem('aie_props', JSON.stringify(DEFAULTS));
    return DEFAULTS;
  }
  return JSON.parse(s);
}
function save(p) {
  localStorage.setItem('aie_props', JSON.stringify(p));
}

// ===== IMAGE FADE HELPER =====
let fadeToken = 0;

function fadeSwapImage(imgEl, newSrc, callback) {
  if (!imgEl || !newSrc) return;

  const myToken = ++fadeToken;

  // Step 1: Fade out
  imgEl.classList.add('img-fading');

  setTimeout(() => {
    // If another fade started, abort this one
    if (myToken !== fadeToken) return;

    // Step 2: Swap the source
    imgEl.src = newSrc;

    const finish = () => {
      if (myToken === fadeToken) {
        imgEl.classList.remove('img-fading');
      }
      if (callback) callback();
    };

    // Step 3: Fade back in (after image loads)
    if (imgEl.complete) {
      setTimeout(finish, 30);
    } else {
      imgEl.onload = finish;
      imgEl.onerror = finish;
    }
  }, 220);
}

// ===== TOAST =====
function toast(title, msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('tt').textContent = title;
  document.getElementById('tm2').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== MENU =====
function toggleMenu() {
  const nl = document.getElementById('nl');
  if (nl) nl.classList.toggle('open');
}
function closeMenu() {
  const nl = document.getElementById('nl');
  if (nl) nl.classList.remove('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('nav')) closeMenu();
});

// ===== IMAGE UPLOAD =====
function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      toast('Invalid File', `${file.name} is not an image.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      compressImage(e.target.result, 1200, 0.75, (compressed) => {
        pendingImages.push(compressed);
        renderImagePreviews();
      });
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function compressImage(dataUrl, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let { width, height } = img;
    if (width > maxWidth) {
      height = Math.round((maxWidth / width) * height);
      width = maxWidth;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.onerror = () => toast('Error', 'Could not load image.');
  img.src = dataUrl;
}

function renderImagePreviews() {
  const preview = document.getElementById('imgPreview');
  if (!preview) return;
  if (!pendingImages.length) { preview.innerHTML = ''; return; }

  preview.innerHTML = pendingImages.map((img, i) => `
    <div style="position:relative; width:80px; height:80px; border-radius:8px; overflow:hidden; border:1px solid var(--gold-b);">
      <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
      ${i === 0 
        ? '<span style="position:absolute; bottom:2px; left:2px; background:var(--gold); color:#2a0808; font-size:.55rem; padding:1px 5px; border-radius:3px; font-weight:700;">COVER</span>' 
        : `<button type="button" onclick="setAsCover(${i})" title="Make this the cover image" style="position:absolute; bottom:2px; left:2px; background:rgba(0,0,0,0.7); color:var(--gold); border:none; padding:1px 6px; border-radius:3px; cursor:pointer; font-size:11px;">★</button>`}
      <button type="button" onclick="removePendingImage(${i})" style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.7); color:#fff; border:none; width:20px; height:20px; border-radius:50%; cursor:pointer; font-size:12px; line-height:1;">×</button>
    </div>
  `).join('');
}

function setAsCover(index) {
  if (index <= 0 || index >= pendingImages.length) return;
  const [img] = pendingImages.splice(index, 1);
  pendingImages.unshift(img);
  renderImagePreviews();
}

function removePendingImage(index) {
  pendingImages.splice(index, 1);
  renderImagePreviews();
}

// ===== PROPERTY CARD =====
function pCard(p) {
  const mainImage = p.image || (p.images && p.images[0]) || '';
  const imgEl = mainImage
    ? `<img src="${mainImage}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const phEl = `<div class="pcard-img-ph" style="display:${mainImage?'none':'flex'}">🏠</div>`;
  return `<div class="pcard" onclick="location.href='detail.html?id=${p.id}'">
    <div class="pcard-img-wrap">
      ${imgEl}${phEl}
      <div class="pcard-badge ${p.status==='Sold'?'badge-sold':'badge-sale'}">${p.status}</div>
      <div class="pcard-price-tag"><div class="lbl">Price</div><div class="amt">PKR ${p.price}</div></div>
    </div>
    <div class="pcard-body">
      <div class="pcard-title">${p.title}</div>
      <div class="pcard-loc">📍 ${p.location}</div>
      <div class="pcard-specs">
        <span class="pcard-spec">🛏 ${p.beds} Beds</span>
        <span class="pcard-spec">🚿 ${p.baths} Baths</span>
        <span class="pcard-spec">📐 ${p.size}</span>
      </div>
      <div class="pcard-foot">
        <span style="font-size:.72rem;color:var(--tm)">Central Park, Lahore</span>
        <button class="btn btn-g btn-sm" onclick="event.stopPropagation();location.href='detail.html?id=${p.id}'">View →</button>
      </div>
    </div>
  </div>`;
}

// ===== HOME: FEATURED =====
function renderFeat() {
  const grid = document.getElementById('featGrid');
  if (!grid) return;
  const p = load().filter(x => x.status !== 'Sold').slice(0, 3);
  grid.innerHTML = p.length ? p.map(pCard).join('') : '<p style="color:var(--tm)">No properties right now.</p>';
}

// ===== PROPERTIES PAGE =====
function renderAll() {
  const grid = document.getElementById('allGrid');
  const empty = document.getElementById('empty');
  if (!grid) return;
  const all = load();
  const filtered = curFilt === 'All' ? all :
                  curFilt === 'For Sale' ? all.filter(p => p.status === 'For Sale') :
                  curFilt === 'Sold' ? all.filter(p => p.status === 'Sold') :
                  all.filter(p => p.size === curFilt);
  grid.innerHTML = filtered.length ? filtered.map(pCard).join('') : '';
  if (empty) empty.style.display = filtered.length ? 'none' : 'block';
  document.querySelectorAll('.ftab').forEach(t => {
    t.classList.toggle('active', t.textContent.trim() === curFilt);
  });
  const count = document.getElementById('propCount');
  if (count) count.textContent = `📊 ${all.length} total · ${filtered.length} shown`;
}

function filt(f) { curFilt = f; renderAll(); }

function heroSearch() {
  const sz = document.getElementById('s-size')?.value;
  const st = document.getElementById('s-status')?.value;
  curFilt = sz !== 'All' ? sz : (st !== 'All' ? st : 'All');
  location.href = 'properties.html?filter=' + encodeURIComponent(curFilt);
}

// ===== CONTACT PAGE =====
function popSelect() {
  const sel = document.getElementById('cpr');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select a property —</option>' +
    load().map(p => `<option value="${p.id}">${p.title} (${p.size})</option>`).join('');
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7Xy7izMPTHTo69VBwGgWynbO6621UCe0G10_4YMA7ShGUq8sWnsyLO2IZMEkLL8GTpA/exec"  ;  // <-- Replace with your URL



function submitContact() {
  const name = document.getElementById('cn')?.value?.trim() || '';
  const phone = document.getElementById('cp')?.value?.trim() || '';
  const email = document.getElementById('ce')?.value?.trim() || '';
  const propertyInterest = document.getElementById('cpr')?.value || '';
  const date = document.getElementById('cd')?.value || '';
  const message = document.getElementById('cm')?.value?.trim() || '';
  if (!name || !phone) { toast('Missing Info', 'Please enter your name and phone number.'); return; }

  const params = new URLSearchParams({ name, phone, email, propertyInterest, date, message });
  const btn = document.querySelector('.bcard .btn-g');
  const originalText = btn ? btn.textContent : 'Send';
  if (btn) { btn.textContent = '⏳ Sending...'; btn.disabled = true; }

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  .then(() => {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
    document.getElementById('cconf')?.classList.add('show');
    toast('✅ Booking Sent!', 'We\'ll contact you within 24 hours.');
    ['cn', 'cp', 'ce', 'cpr', 'cd', 'cm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  })
  .catch(error => {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
    console.error('Fetch error:', error);
    toast('❌ Error', 'Could not connect to server.');
  });
}

// ===== DETAIL PAGE =====
let currentGalleryImages = [];
let currentImageIndex = 0;

function renderDetail(id) {
  const wrap = document.getElementById('detailWrap');
  if (!wrap) return;
  const p = load().find(x => x.id === id);
  if (!p) {
    wrap.innerHTML = `<div style="max-width:1200px;margin:0 auto;padding:4rem 2.5rem;text-align:center"><h2 class="disp">Property not found</h2><button class="btn btn-g" style="margin-top:1.5rem" onclick="location.href='properties.html'">Browse Properties →</button></div>`;
    return;
  }

  // Build images array (backward compatible)
  const images = (p.images && p.images.length) ? p.images : (p.image ? [p.image] : []);
  currentGalleryImages = images;
  currentImageIndex = 0;

  const mainImage = images[0] || '';
  const fi = (p.features || []).map(f => `<div class="fi"><div class="fdot"></div>${f}</div>`).join('');

  // Gallery HTML
  let galleryHtml = '';
  if (images.length === 0) {
    galleryHtml = `<div class="dimg-ph">🏠</div>`;
  } else if (images.length === 1) {
    galleryHtml = `
      <div class="dimg-wrap" onclick="openLightbox(0)">
        <img src="${images[0]}" alt="${p.title}" onerror="this.style.display='none'">
      </div>`;
  } else {
    // Multiple images → full gallery
    galleryHtml = `
      <div class="gallery">
        <div class="gallery-main" onclick="openLightbox(currentImageIndex)">
          <img id="galleryMainImg" src="${images[0]}" alt="${p.title}">
          <div class="gallery-counter" id="galleryCounter">1 / ${images.length}</div>
          <button class="gallery-nav gallery-prev" onclick="event.stopPropagation();prevImage()">‹</button>
          <button class="gallery-nav gallery-next" onclick="event.stopPropagation();nextImage()">›</button>
        </div>
        <div class="gallery-thumbs" id="galleryThumbs">
          ${images.map((img, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage(${i})">
              <img src="${img}" alt="View ${i + 1}">
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  wrap.innerHTML = `
    <button class="back" onclick="location.href='properties.html'">← Back to Properties</button>
    ${galleryHtml}
    <div class="dcontent">
      <div>
        <div class="pcard-badge ${p.status==='Sold'?'badge-sold':'badge-sale'}" style="margin-bottom:.9rem;display:inline-block">${p.status}</div>
        <h1 class="disp" style="font-size:2.2rem;margin-bottom:.4rem;line-height:1.1">${p.title}</h1>
        <p style="color:var(--tm);font-size:.83rem;margin-bottom:.25rem">📍 ${p.location}</p>
        <div class="specs-row">
          <div class="spec-item"><div class="spec-v">${p.beds}</div><div class="spec-k">Bedrooms</div></div>
          <div class="spec-item"><div class="spec-v">${p.baths}</div><div class="spec-k">Bathrooms</div></div>
          <div class="spec-item"><div class="spec-v">${p.size}</div><div class="spec-k">Size</div></div>
          <div class="spec-item"><div class="spec-v" style="font-size:1.05rem">PKR ${p.price}</div><div class="spec-k">Price</div></div>
        </div>
        <h3 style="margin-bottom:.6rem;font-size:1.2rem">About This Property</h3>
        <p style="color:var(--ts);line-height:1.85;margin-bottom:1.75rem">${p.description}</p>
        ${fi ? `<h3 style="margin-bottom:.7rem;font-size:1.2rem">Features &amp; Amenities</h3><div class="fgrid">${fi}</div>` : ''}
        <div style="margin-top:2rem;padding:1.25rem;background:var(--card);border-radius:12px;border:.5px solid var(--gold-b)">
          <p style="font-size:.83rem;color:var(--ts)">📞 Interested? Call or WhatsApp us: <a href="tel:03214703013" style="color:var(--gold);font-weight:600">0321-4703013</a></p>
        </div>
      </div>
      <div>
        <div class="bcard">
          <div class="bcard-head"><h3>Book a Tour</h3><p>Free · No obligation · Confirmed in 24 hrs</p></div>
          <div class="fg"><label>Name</label><input id="bn" type="text" placeholder="Ahmed Khan"></div>
          <div class="fg"><label>Phone / WhatsApp</label><input id="bp" type="tel" placeholder="03XX-XXXXXXX"></div>
          <div class="fg"><label>Email</label><input id="be" type="email" placeholder="your@email.com"></div>
          <div class="fg"><label>Preferred Date</label><input id="bd" type="date"></div>
          <div class="fg"><label>Message</label><textarea id="bm" placeholder="Any questions..."></textarea></div>
          <button class="btn btn-g" style="width:100%" onclick="bookTour(${p.id},'${p.title.replace(/'/g,"\\'")}')">Book Tour →</button>
          <div class="confirm" id="bconf"><strong>✓ Tour Booked!</strong><br>We'll WhatsApp you within 24 hours to confirm.</div>
        </div>
      </div>
    </div>`;

  const dateInput = document.getElementById('bd');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}

// ===== GALLERY FUNCTIONS =====
function switchImage(index) {
  if (!currentGalleryImages.length) return;
  if (index < 0) index = currentGalleryImages.length - 1;
  if (index >= currentGalleryImages.length) index = 0;

  currentImageIndex = index;
  const mainImg = document.getElementById('galleryMainImg');
  const counter = document.getElementById('galleryCounter');

  if (mainImg) {
    fadeSwapImage(mainImg, currentGalleryImages[index]);
  }
  if (counter) {
    counter.textContent = `${index + 1} / ${currentGalleryImages.length}`;
  }

  // Update active thumbnail
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });

  // Scroll active thumb into view
  const activeThumb = document.querySelector('.gallery-thumb.active');
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function nextImage() { switchImage(currentImageIndex + 1); }
function prevImage() { switchImage(currentImageIndex - 1); }

// ===== LIGHTBOX =====
function openLightbox(index) {
  if (!currentGalleryImages.length) return;
  currentImageIndex = index;
  renderLightbox();

  // Keyboard listener
  document.addEventListener('keydown', lightboxKeyHandler);

  // Touch swipe
  const lb = document.getElementById('lightbox');
  if (lb) {
    let touchStartX = 0;
    lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prevImage(); else nextImage();
        updateLightboxImage();
      }
    }, { passive: true });
  }
}

function renderLightbox() {
  let lb = document.getElementById('lightbox');
  if (lb) lb.remove();

  const html = `
    <div id="lightbox" class="lightbox" onclick="closeLightboxOnBackdrop(event)">
      <button class="lightbox-close" onclick="closeLightbox()">×</button>
      <button class="lightbox-arrow lightbox-prev" onclick="event.stopPropagation();prevImage();updateLightboxImage()">‹</button>
      <img id="lightboxImg" src="${currentGalleryImages[currentImageIndex]}" onclick="event.stopPropagation()">
      <button class="lightbox-arrow lightbox-next" onclick="event.stopPropagation();nextImage();updateLightboxImage()">›</button>
      <div class="lightbox-counter" id="lightboxCounter">${currentImageIndex + 1} / ${currentGalleryImages.length}</div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');

  if (img) {
    fadeSwapImage(img, currentGalleryImages[currentImageIndex]);
  }
  if (counter) {
    counter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
  }

  // Sync the main gallery behind the lightbox — no fade, since it's hidden anyway
  const mainImg = document.getElementById('galleryMainImg');
  const mainCounter = document.getElementById('galleryCounter');
  if (mainImg) mainImg.src = currentGalleryImages[currentImageIndex];
  if (mainCounter) {
    mainCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
  }
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentImageIndex);
  });
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.remove();
  document.body.style.overflow = '';
  document.removeEventListener('keydown', lightboxKeyHandler);
}

function closeLightboxOnBackdrop(e) {
  if (e.target.id === 'lightbox') closeLightbox();
}

function lightboxKeyHandler(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { prevImage(); updateLightboxImage(); }
  if (e.key === 'ArrowRight') { nextImage(); updateLightboxImage(); }
}

function bookTour(id, title) {
  const name = document.getElementById('bn')?.value?.trim() || '';
  const phone = document.getElementById('bp')?.value?.trim() || '';
  const email = document.getElementById('be')?.value?.trim() || '';
  const date = document.getElementById('bd')?.value || '';
  const message = document.getElementById('bm')?.value?.trim() || '';
  if (!name || !phone) { toast('Missing Info', 'Please enter your name and phone number.'); return; }

  const params = new URLSearchParams({ name, phone, email, propertyTitle: title, date, message });
  const btn = document.querySelector('#detailWrap .bcard .btn-g');
  const originalText = btn ? btn.textContent : 'Book Tour';
  if (btn) { btn.textContent = '⏳ Sending...'; btn.disabled = true; }

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  .then(() => {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
    document.getElementById('bconf')?.classList.add('show');
    toast('✅ Tour Booked!', 'We\'ll contact you within 24 hours.');
    ['bn', 'bp', 'be', 'bd', 'bm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  })
  .catch(error => {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
    console.error('Fetch error:', error);
    toast('❌ Error', 'Could not connect to server.');
  });
}

// ===== ADMIN =====
function aLogin() {
  const input = document.getElementById('ap');
  if (!input) return;
  if (input.value === PASS) {
    authed = true;
    document.getElementById('aLogin').style.display = 'none';
    const dash = document.getElementById('aDash');
    dash.style.display = 'block';
    dash.classList.add('show');
    renderAList();
    document.getElementById('aerr').style.display = 'none';
  } else {
    document.getElementById('aerr').style.display = 'block';
  }
}

function aLogout() {
  authed = false;
  document.getElementById('aLogin').style.display = 'block';
  const dash = document.getElementById('aDash');
  dash.style.display = 'none';
  dash.classList.remove('show');
  document.getElementById('ap').value = '';
}

function renderAList() {
  const el = document.getElementById('aPropList');
  if (!el) return;
  const props = load();
  if (!props.length) {
    el.innerHTML = '<p style="color:var(--tm)">No properties yet.</p>';
    return;
  }
  el.innerHTML = props.map(p => `
    <div class="aprow">
      <div style="display:flex; align-items:center; gap:12px; min-width:0;">
        ${(p.image || (p.images && p.images[0])) 
          ? `<img src="${p.image || p.images[0]}" style="width:48px; height:48px; border-radius:6px; object-fit:cover; flex-shrink:0; border:.5px solid var(--gold-b);">` 
          : ''}
        <div style="min-width:0;">
          <div style="font-weight:500;font-size:.9rem">${p.title}</div>
          <div style="font-size:.76rem;color:var(--tm);margin-top:2px">
            ${p.size} · PKR ${p.price} · 
            <span style="color:${p.status==='For Sale'?'var(--gold)':'var(--tm)'}">${p.status}</span>
            ${(p.images && p.images.length > 1) ? ` · 📷 ${p.images.length} images` : ''}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;">
        <button class="btn btn-o" style="font-size:.68rem;padding:5px 11px" onclick="startEdit(${p.id})">✎ Edit</button>
        <button class="btn btn-o" style="font-size:.68rem;padding:5px 11px" onclick="toggleSt(${p.id})">${p.status==='For Sale'?'Mark Sold':'Mark For Sale'}</button>
        <button class="btn-del" onclick="delProp(${p.id})">Delete</button>
      </div>
    </div>`).join('');
}

// ===== EDIT MODE =====
function startEdit(id) {
  const p = load().find(x => x.id === id);
  if (!p) return;

  editingId = id;

  // Fill the form
  document.getElementById('nt').value = p.title || '';
  document.getElementById('np').value = p.price || '';
  document.getElementById('ns').value = p.size || '5 Marla';
  document.getElementById('nst').value = p.status || 'For Sale';
  document.getElementById('nb').value = p.beds || 3;
  document.getElementById('nbth').value = p.baths || 2;
  document.getElementById('nd').value = p.description || '';
  document.getElementById('nf').value = (p.features || []).join(', ');

  // Load existing images into pendingImages
  pendingImages = (p.images && p.images.length) 
    ? p.images.slice() 
    : (p.image ? [p.image] : []);
  renderImagePreviews();

  // Switch UI to Edit mode
  document.getElementById('propFormTitle').textContent = `✎ Editing: ${p.title}`;
  document.getElementById('propFormBtn').textContent = 'Update Property ✓';
  document.getElementById('propFormCancel').style.display = 'inline-flex';

  // Scroll to form
  document.getElementById('propFormCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit() {
  editingId = null;
  // Clear form
  ['nt', 'np', 'nb', 'nbth', 'nd', 'nf'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('ns').value = '5 Marla';
  document.getElementById('nst').value = 'For Sale';

  // Clear images
  pendingImages = [];
  renderImagePreviews();

  // Reset UI
  document.getElementById('propFormTitle').textContent = 'Add New Property';
  document.getElementById('propFormBtn').textContent = 'Add Property →';
  document.getElementById('propFormCancel').style.display = 'none';
}

function addProp() {
  const title = document.getElementById('nt')?.value?.trim() || '';
  const price = document.getElementById('np')?.value?.trim() || '';
  if (!title || !price) {
    toast('Missing Fields', 'Title and price are required.');
    return;
  }

  const props = load();
  const isEdit = editingId !== null;

  // Determine images
  const images = pendingImages.length > 0
    ? pendingImages.slice()
    : [IMGS[Math.floor(Math.random() * IMGS.length)]];

  if (isEdit) {
    // ===== UPDATE EXISTING =====
    const index = props.findIndex(p => p.id === editingId);
    if (index === -1) {
      toast('Error', 'Property not found.');
      cancelEdit();
      return;
    }

    props[index] = {
      ...props[index], // preserve any fields we don't touch
      title,
      price,
      size: document.getElementById('ns')?.value || '5 Marla',
      status: document.getElementById('nst')?.value || 'For Sale',
      beds: parseInt(document.getElementById('nb')?.value) || 3,
      baths: parseInt(document.getElementById('nbth')?.value) || 2,
      image: images[0],
      images: images,
      description: document.getElementById('nd')?.value.trim() || 'A quality home in Central Park, Lahore.',
      features: (document.getElementById('nf')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      save(props);
    } catch (err) {
      toast('❌ Storage Full', 'Too many images. Remove some images or delete other properties.');
      console.error('Save error:', err);
      return;
    }

    renderAList();
    cancelEdit(); // resets form to Add mode
    toast('Property Updated ✅', `"${title}" has been updated.`);
  } else {
    // ===== CREATE NEW =====
    const newId = props.length ? Math.max(...props.map(p => p.id)) + 1 : 1;

    const newProp = {
      id: newId,
      title,
      price,
      size: document.getElementById('ns')?.value || '5 Marla',
      status: document.getElementById('nst')?.value || 'For Sale',
      beds: parseInt(document.getElementById('nb')?.value) || 3,
      baths: parseInt(document.getElementById('nbth')?.value) || 2,
      location: 'Central Park, Lahore',
      image: images[0],
      images: images,
      description: document.getElementById('nd')?.value.trim() || 'A quality home in Central Park, Lahore.',
      features: (document.getElementById('nf')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
    };

    props.push(newProp);

    try {
      save(props);
    } catch (err) {
      toast('❌ Storage Full', 'Too many images. Remove some images or use smaller images.');
      console.error('Save error:', err);
      return;
    }

    renderAList();

    // Clear form
    ['nt', 'np', 'nb', 'nbth', 'nd', 'nf'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    pendingImages = [];
    renderImagePreviews();

    toast('Property Added ✅', `"${title}" is now live. Total: ${props.length}`);
  }
}

function delProp(id) {
  if (!confirm('Delete this property?')) return;
  save(load().filter(p => p.id !== id));
  renderAList();
  toast('Deleted', 'Property removed.');
}

function toggleSt(id) {
  save(load().map(x => x.id === id ? { ...x, status: x.status === 'For Sale' ? 'Sold' : 'For Sale' } : x));
  renderAList();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[type="date"]').forEach(el => el.min = new Date().toISOString().split('T')[0]);

  const path = window.location.pathname;
  if (path.includes('index.html') || path === '/' || path === '') {
    renderFeat();
  } else if (path.includes('properties.html')) {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (filter) curFilt = filter;
    renderAll();
  } else if (path.includes('contact.html')) {
    popSelect();
  } else if (path.includes('detail.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    if (id) renderDetail(id);
  }
});

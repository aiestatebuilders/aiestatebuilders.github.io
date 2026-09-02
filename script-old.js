// ===== DATA MANAGEMENT =====
const PASS = 'aiestate2025';
let authed = false;
let curFilt = 'All';

const IMGS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'
];

const DEFAULTS = [
  {id:1,title:'Modern 5 Marla Corner House',location:'Central Park, Lahore',price:'1.2 Crore',size:'5 Marla',beds:3,baths:3,status:'For Sale',description:'A beautifully designed corner 5 Marla house in the heart of Central Park Housing Scheme. Built with premium materials and a modern layout perfect for a family of four. Ground plus one floor with spacious rooms, high ceilings, and excellent ventilation throughout.',features:['Marble Flooring','Modern Kitchen','Backup Generator','Rooftop Access','Guest Parking','CCTV Ready'],image:IMGS[0]},
  {id:2,title:'Luxury 10 Marla Villa',location:'Central Park, Lahore',price:'2.8 Crore',size:'10 Marla',beds:5,baths:5,status:'For Sale',description:'An exquisite 10 Marla villa with premium finishes throughout. Grand entrance, formal lounge, separate dining, and a stunning kitchen. Landscaped garden and servant quarters included.',features:['Landscaped Garden','Servant Quarters','Smart Home Wiring','Marble Throughout','Double Garage','Solar Ready'],image:IMGS[1]},
  {id:3,title:'Contemporary 5 Marla Home',location:'Central Park, Lahore',price:'1.05 Crore',size:'5 Marla',beds:3,baths:2,status:'Sold',description:'A modern and well-planned 5 Marla residential property featuring contemporary design with quality tile flooring, a well-equipped kitchen, and separate lounge and dining areas. Ready to move in condition.',features:['Tile Flooring','Modern Bathrooms','TV Lounge','Kitchen Cabinets','Boundary Wall','Main Boulevard'],image:IMGS[2]},
  {id:4,title:'Premium 10 Marla House',location:'Central Park, Lahore',price:'2.5 Crore',size:'10 Marla',beds:4,baths:4,status:'For Sale',description:'A premium 10 Marla house with top-quality construction in a prime block of Central Park. Spacious bedrooms with attached baths, grand entrance porch, and rooftop with a beautiful view of the housing scheme.',features:['Attached Bathrooms','Entrance Porch','Rooftop Space','Underground Tank','Gas Connection','Electricity Backup'],image:IMGS[3]},
  {id:5,title:'Elegant 5 Marla Family Home',location:'Central Park, Lahore',price:'1.15 Crore',size:'5 Marla',beds:3,baths:3,status:'For Sale',description:'A well-designed 5 Marla house ideal for a growing family. Located in a quiet street with easy access to the main gate and commercial area. Fully tiled, plastered, and ready for fitout.',features:['Corner Adjacent','Quiet Street','Near Commercial','Full Tile Work','Quality Plastering','Strong Structure'],image:IMGS[4]}
];

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
  console.log('💾 Saved to localStorage:', p.length, 'properties');
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

// ===== MENU TOGGLE =====
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

// ===== PROPERTY CARD RENDERER (FIXED - no zoom issues) =====
function pCard(p) {
  // Ensure all fields exist with defaults
  const title = p.title || 'Untitled Property';
  const price = p.price || '0';
  const size = p.size || '5 Marla';
  const status = p.status || 'For Sale';
  const beds = p.beds || 3;
  const baths = p.baths || 2;
  const location = p.location || 'Central Park, Lahore';
  const image = p.image || '';
  const id = p.id || 0;

  const imgEl = image
    ? `<img src="${image}" alt="${title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const phEl = `<div class="pcard-img-ph" style="display:${image?'none':'flex'}">🏠</div>`;

  return `<div class="pcard" onclick="location.href='detail.html?id=${id}'">
    <div class="pcard-img-wrap">
      ${imgEl}${phEl}
      <div class="pcard-badge ${status==='Sold'?'badge-sold':'badge-sale'}">${status}</div>
      <div class="pcard-price-tag"><div class="lbl">Price</div><div class="amt">PKR ${price}</div></div>
    </div>
    <div class="pcard-body">
      <div class="pcard-title">${title}</div>
      <div class="pcard-loc">📍 ${location}</div>
      <div class="pcard-specs">
        <span class="pcard-spec">🛏 ${beds} Beds</span>
        <span class="pcard-spec">🚿 ${baths} Baths</span>
        <span class="pcard-spec">📐 ${size}</span>
      </div>
      <div class="pcard-foot">
        <span style="font-size:.72rem;color:var(--tm)">Central Park, Lahore</span>
        <button class="btn btn-g btn-sm" onclick="event.stopPropagation();location.href='detail.html?id=${id}'">View →</button>
      </div>
    </div>
  </div>`;
}

// ===== HOME PAGE: FEATURED =====
function renderFeat() {
  const grid = document.getElementById('featGrid');
  if (!grid) return;
  const p = load().filter(x => x.status !== 'Sold').slice(0, 3);
  grid.innerHTML = p.length ? p.map(pCard).join('') : '<p style="color:var(--tm)">No properties right now.</p>';
}

// ===== PROPERTIES PAGE: ALL GRID & FILTER =====
function renderAll() {
  const grid = document.getElementById('allGrid');
  const empty = document.getElementById('empty');
  if (!grid) return;
  const all = load();
  const f = curFilt === 'All' ? all :
           curFilt === 'For Sale' ? all.filter(p => p.status === 'For Sale') :
           curFilt === 'Sold' ? all.filter(p => p.status === 'Sold') :
           all.filter(p => p.size === curFilt);
  grid.innerHTML = f.length ? f.map(pCard).join('') : '';
  if (empty) empty.style.display = f.length ? 'none' : 'block';
  document.querySelectorAll('.ftab').forEach(t => {
    t.classList.toggle('active', t.textContent.trim() === curFilt);
  });
}

function filt(f, btn) {
  curFilt = f;
  renderAll();
  const url = new URL(window.location);
  url.searchParams.set('filter', f);
  window.history.replaceState({}, '', url);
}

function heroSearch() {
  const sz = document.getElementById('s-size').value;
  const st = document.getElementById('s-status').value;
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

function submitContact() {
  const n = document.getElementById('cn').value.trim();
  const p = document.getElementById('cp').value.trim();
  if (!n || !p) { toast('Missing Info', 'Please enter your name and phone number.'); return; }
  const b = JSON.parse(localStorage.getItem('aie_bookings') || '[]');
  b.push({
    name: n,
    phone: p,
    prop: document.getElementById('cpr').value,
    date: document.getElementById('cd').value,
    msg: document.getElementById('cm').value,
    at: new Date().toISOString()
  });
  localStorage.setItem('aie_bookings', JSON.stringify(b));
  document.getElementById('cconf').classList.add('show');
  toast('Inquiry Sent!', `We'll reach out to ${n} soon.`);
}

// ===== DETAIL PAGE =====
function renderDetail(id) {
  const wrap = document.getElementById('detailWrap');
  if (!wrap) return;
  const p = load().find(x => x.id === id);
  if (!p) {
    wrap.innerHTML = `
      <div style="max-width:1200px;margin:0 auto;padding:4rem 2.5rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <h2 class="disp">Property not found</h2>
        <p style="color:var(--tm)">Please go back and select a valid property.</p>
        <button class="btn btn-g" style="margin-top:1.5rem" onclick="location.href='properties.html'">Browse Properties →</button>
      </div>
    `;
    return;
  }

  const fi = (p.features || []).map(f => `<div class="fi"><div class="fdot"></div>${f}</div>`).join('');
  const imgHtml = p.image
    ? `<div class="dimg-wrap"><img src="${p.image}" alt="${p.title}" onerror="this.style.display='none'"></div>`
    : `<div class="dimg-ph">🏠</div>`;

  wrap.innerHTML = `
    <button class="back" onclick="location.href='properties.html'">← Back to Properties</button>
    ${imgHtml}
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
          <div class="fg"><label>Preferred Date</label><input id="bd" type="date"></div>
          <div class="fg"><label>Message</label><textarea id="bm" placeholder="Any questions..."></textarea></div>
          <button class="btn btn-g" style="width:100%" onclick="bookTour(${p.id},'${p.title.replace(/'/g,"\\'")}')">Book Tour →</button>
          <div class="confirm" id="bconf"><strong>✓ Tour Booked!</strong><br>We'll WhatsApp you within 24 hours to confirm.</div>
        </div>
      </div>
    </div>
  `;

  const dateInput = document.getElementById('bd');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}

function bookTour(id, title) {
  const n = document.getElementById('bn').value.trim();
  const p = document.getElementById('bp').value.trim();
  if (!n || !p) { toast('Missing Info', 'Please enter your name and phone number.'); return; }
  const b = JSON.parse(localStorage.getItem('aie_bookings') || '[]');
  b.push({
    id, title, name: n, phone: p,
    date: document.getElementById('bd').value,
    msg: document.getElementById('bm').value,
    at: new Date().toISOString()
  });
  localStorage.setItem('aie_bookings', JSON.stringify(b));
  document.getElementById('bconf').classList.add('show');
  toast('Tour Booked!', `We'll contact ${n} shortly.`);
}

// ===== ADMIN PANEL =====
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
      <div>
        <div style="font-weight:500;font-size:.9rem">${p.title}</div>
        <div style="font-size:.76rem;color:var(--tm);margin-top:2px">${p.size} · PKR ${p.price} · <span style="color:${p.status==='For Sale'?'var(--gold)':'var(--tm)'}">${p.status}</span></div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="btn btn-o" style="font-size:.68rem;padding:5px 11px" onclick="toggleSt(${p.id})">${p.status==='For Sale'?'Mark Sold':'Mark For Sale'}</button>
        <button class="btn-del" onclick="delProp(${p.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// ===== FIXED addProp() with full debugging =====
function addProp() {
  console.log('🔵 addProp() called');

  // 1. Read all form values with fallbacks
  const title = document.getElementById('nt')?.value?.trim() || '';
  const price = document.getElementById('np')?.value?.trim() || '';
  const size = document.getElementById('ns')?.value || '5 Marla';
  const status = document.getElementById('nst')?.value || 'For Sale';
  const beds = parseInt(document.getElementById('nb')?.value) || 3;
  const baths = parseInt(document.getElementById('nbth')?.value) || 2;
  const image = document.getElementById('ni')?.value?.trim() || IMGS[Math.floor(Math.random() * IMGS.length)];
  const description = document.getElementById('nd')?.value?.trim() || 'A quality home in Central Park, Lahore.';
  const featuresRaw = document.getElementById('nf')?.value?.trim() || '';
  const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

  console.log('📝 Form values:', { title, price, size, status, beds, baths, image, description, features });

  // 2. Validate required fields
  if (!title || !price) {
    toast('❌ Missing Fields', 'Title and price are required.');
    console.log('❌ Validation failed: missing title or price');
    return;
  }

  // 3. Load existing properties
  const props = load();
  console.log('📦 Existing properties:', props.length);

  // 4. Generate new ID
  const newId = props.length > 0 ? Math.max(...props.map(p => p.id)) + 1 : 1;
  console.log('🆕 New ID:', newId);

  // 5. Build the new property object
    const newProp = {
    id: newId,
    title: title,
    price: price,
    location: 'Central Park, Lahore',
    size: size,
    status: status,
    beds: beds,
    baths: baths,
    image: image,
    description: description,
    features: features
  };
 



  console.log('🏠 New property object:', newProp);

  // 6. Save
  props.push(newProp);
  save(props);

  // 7. Verify it saved
  const saved = load();
  console.log('✅ Total properties after save:', saved.length);
  console.log('📋 All properties:', saved);

  // 8. Refresh the admin list
  renderAList();

  // 9. Clear the form
  ['nt', 'np', 'nb', 'nbth', 'ni', 'nd', 'nf'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  toast('✅ Property Added', `"${title}" is now live. Total: ${saved.length} properties.`);
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
  // Date inputs min
  document.querySelectorAll('input[type="date"]').forEach(el => {
    el.min = new Date().toISOString().split('T')[0];
  });

  const path = window.location.pathname;
  if (path.includes('index.html') || path === '/' || path === '') {
    renderFeat();
  } else if (path.includes('properties.html')) {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (filter) {
      curFilt = filter;
      document.querySelectorAll('.ftab').forEach(t => {
        if (t.textContent.trim() === curFilt) t.classList.add('active');
        else t.classList.remove('active');
      });
    }
    renderAll();
  } else if (path.includes('contact.html')) {
    popSelect();
  } else if (path.includes('admin.html')) {
    // Admin page – nothing to auto-load
  } else if (path.includes('detail.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    if (id) renderDetail(id);
  }
});

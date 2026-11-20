/**
 * GLOZA // Modern Luxury Sneaker Reselling Platform Engine
 * Clean, Contemporary E-Commerce Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCountdown();
  initVideoStudio();
  initAnatomyViewer();
  initCatalog();
  initCalculator();
  initScanner();
  initCartDrawer();
  initQuickViewModal();
  initAudioHoverFeedback();
});

/* ==========================================================================
   1. AUDIO FEEDBACK
   ========================================================================== */
function initAudioHoverFeedback() {
  const hoverables = 'a, button, input, select, .anatomy-beacon-dot, .sneaker-card, .angle-preset-btn, .size-pill-option';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) {
      if (window.glozaAudio) window.glozaAudio.playHover();
    }
  });
}

/* ==========================================================================
   2. NAVIGATION & SOUND TOGGLE
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.gloza-navbar');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (soundBtn) {
    if (window.glozaAudio && window.glozaAudio.enabled) {
      soundBtn.classList.add('active');
    }

    soundBtn.addEventListener('click', () => {
      if (window.glozaAudio) {
        const isEnabled = window.glozaAudio.toggle();
        soundBtn.classList.toggle('active', isEnabled);
        const label = soundBtn.querySelector('.sound-btn-text');
        if (label) label.textContent = isEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      }
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

/* ==========================================================================
   3. LIVE DROP COUNTDOWN
   ========================================================================== */
function initCountdown() {
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = 5 * 3600 + 42 * 60 + 19;

  setInterval(() => {
    if (totalSeconds > 0) totalSeconds--;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ==========================================================================
   4. VIDEO STUDIO & 360 TURNTABLE CONTROLS
   ========================================================================== */
function initVideoStudio() {
  // Reel Player
  const reelVideo = document.getElementById('reel-video');
  const reelPlayBtn = document.getElementById('reel-play-btn');
  const reelMuteBtn = document.getElementById('reel-mute-btn');
  const chapterBtns = document.querySelectorAll('.chapter-chip, .timestamp-btn');

  if (reelVideo && reelPlayBtn) {
    function toggleReel() {
      if (reelVideo.paused) {
        reelVideo.play();
        reelPlayBtn.style.opacity = '0';
        reelPlayBtn.style.pointerEvents = 'none';
        if (window.glozaAudio) window.glozaAudio.playClick();
      } else {
        reelVideo.pause();
        reelPlayBtn.style.opacity = '1';
        reelPlayBtn.style.pointerEvents = 'auto';
      }
    }

    reelPlayBtn.addEventListener('click', toggleReel);
    reelVideo.addEventListener('click', toggleReel);

    if (reelMuteBtn) {
      reelMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        reelVideo.muted = !reelVideo.muted;
        reelMuteBtn.textContent = reelVideo.muted ? 'UNMUTE AUDIO' : 'MUTE AUDIO';
      });
    }

    chapterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const time = parseFloat(btn.getAttribute('data-time') || '0');
        reelVideo.currentTime = time;
        if (reelVideo.paused) reelVideo.play();
        reelPlayBtn.style.opacity = '0';
        chapterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.glozaAudio) window.glozaAudio.playClick();
      });
    });
  }

  // 360 Turntable Video
  const spinVideo = document.getElementById('turntable-video');
  const scrubber = document.getElementById('angle-scrubber');
  const degreeVal = document.getElementById('degree-val');
  const presetChips = document.querySelectorAll('.angle-preset-btn, .preset-chip');
  const turntableWrapper = document.querySelector('.turntable-stage-clean, .turntable-video-wrapper');

  if (spinVideo && scrubber && degreeVal) {
    let isDragging360 = false;
    let startX = 0;
    let startDeg = 0;

    spinVideo.addEventListener('loadedmetadata', () => {
      spinVideo.pause();
      spinVideo.currentTime = 0;
    });

    scrubber.addEventListener('input', (e) => {
      spinVideo.pause();
      const deg = parseInt(e.target.value, 10);
      degreeVal.textContent = `${deg}°`;
      if (spinVideo.duration) {
        spinVideo.currentTime = (deg / 360) * spinVideo.duration;
      }
    });

    // Direct Mouse & Touch Drag-To-Rotate
    if (turntableWrapper) {
      turntableWrapper.addEventListener('mousedown', (e) => {
        isDragging360 = true;
        startX = e.clientX;
        startDeg = parseInt(scrubber.value, 10);
        turntableWrapper.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging360) return;
        const deltaX = e.clientX - startX;
        let newDeg = (startDeg + Math.round(deltaX * 0.9)) % 360;
        if (newDeg < 0) newDeg += 360;
        scrubber.value = newDeg;
        degreeVal.textContent = `${newDeg}°`;
        if (spinVideo.duration) {
          spinVideo.currentTime = (newDeg / 360) * spinVideo.duration;
        }
      });

      window.addEventListener('mouseup', () => {
        if (isDragging360) {
          isDragging360 = false;
          turntableWrapper.style.cursor = 'grab';
        }
      });

      // Touch events
      turntableWrapper.addEventListener('touchstart', (e) => {
        isDragging360 = true;
        startX = e.touches[0].clientX;
        startDeg = parseInt(scrubber.value, 10);
      }, { passive: true });

      turntableWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging360) return;
        const deltaX = e.touches[0].clientX - startX;
        let newDeg = (startDeg + Math.round(deltaX * 0.9)) % 360;
        if (newDeg < 0) newDeg += 360;
        scrubber.value = newDeg;
        degreeVal.textContent = `${newDeg}°`;
        if (spinVideo.duration) {
          spinVideo.currentTime = (newDeg / 360) * spinVideo.duration;
        }
      }, { passive: true });

      turntableWrapper.addEventListener('touchend', () => {
        isDragging360 = false;
      });
    }

    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const deg = parseInt(chip.getAttribute('data-deg') || '0', 10);
        scrubber.value = deg;
        degreeVal.textContent = `${deg}°`;
        if (spinVideo.duration) {
          spinVideo.currentTime = (deg / 360) * spinVideo.duration;
        }
        if (window.glozaAudio) window.glozaAudio.playClick();
      });
    });

    // Auto rotate toggle
    const autoSpinBtn = document.getElementById('btn-auto-spin');
    let autoSpinInterval = null;
    if (autoSpinBtn) {
      autoSpinBtn.addEventListener('click', () => {
        if (autoSpinInterval) {
          clearInterval(autoSpinInterval);
          autoSpinInterval = null;
          autoSpinBtn.textContent = 'AUTO ROTATE: OFF';
        } else {
          autoSpinBtn.textContent = 'AUTO ROTATE: ON';
          autoSpinInterval = setInterval(() => {
            let currentDeg = (parseInt(scrubber.value, 10) + 2) % 360;
            scrubber.value = currentDeg;
            degreeVal.textContent = `${currentDeg}°`;
            if (spinVideo.duration) {
              spinVideo.currentTime = (currentDeg / 360) * spinVideo.duration;
            }
          }, 35);
        }
        if (window.glozaAudio) window.glozaAudio.playClick();
      });
    }
  }
}

/* ==========================================================================
   5. 4-POINT SNEAKER CRAFTSMANSHIP & ANATOMY
   ========================================================================== */
const anatomyData = {
  1: {
    title: 'Holographic Swoosh & Heel Graphic',
    desc: 'Features shifting holographic prism technology on the Nike Swoosh and heel insignia, casting dynamic cyan-to-violet iridescent refractions under light.',
    image: 'assets/born-x-raised-side.jpg',
    specs: [
      { key: 'Material', val: 'Iridescent Lens Polymer' },
      { key: 'Feature', val: 'Prismatic Light Refraction' },
      { key: 'Condition', val: 'Factory Flawless (10/10)' }
    ]
  },
  2: {
    title: 'Fat SB Laces // "In Loving Memory"',
    desc: 'Premium plush SB fat laces laser-embroidered with "In Loving Memory" typography, paying tribute to late Born x Raised founder Chris "Spanto" Printup.',
    image: 'assets/born-x-raised-laces.jpg',
    specs: [
      { key: 'Typography', val: 'Embroidered Script Lettering' },
      { key: 'Aglet Detail', val: 'Metal Laser-Etched Tips' },
      { key: 'Colorway', val: 'Deep Venice Teal / White' }
    ]
  },
  3: {
    title: 'Embossed "ON THE TURF" Heel Midsole',
    desc: '3D raised block lettering stamped directly into the rubberized midsole and "BORN SB" iridescent heel tab, establishing unmistakable street prestige.',
    image: 'assets/born-x-raised-heel.jpg',
    specs: [
      { key: 'Embossing', val: 'Industrial High-Relief Stamping' },
      { key: 'Heel Structure', val: 'Reinforced Skate Cupsole' },
      { key: 'Authenticity', val: 'GLOZA NFC Verified Chip' }
    ]
  },
  4: {
    title: 'Translucent Ice-Blue Outsole Artwork',
    desc: 'Semi-transparent frozen blue traction rubber showcasing massive underfoot Born SB custom graphics and hot pink Zoom Air contrast pod.',
    image: 'assets/born-x-raised-sole.jpg',
    specs: [
      { key: 'Traction', val: 'Circular SB Pivot Tread' },
      { key: 'Underlay', val: 'Full-Bed Born SB Typography' },
      { key: 'Cushioning', val: 'Nike Zoom Air Unit' }
    ]
  }
};

function initAnatomyViewer() {
  const hotspots = document.querySelectorAll('.anatomy-beacon-dot, .hotspot-point');
  const previewImg = document.getElementById('anatomy-macro-img');
  const titleEl = document.getElementById('anatomy-feature-title');
  const descEl = document.getElementById('anatomy-feature-desc');
  const specsList = document.getElementById('anatomy-specs-list');

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      hotspots.forEach(s => s.classList.remove('active'));
      spot.classList.add('active');

      const id = spot.getAttribute('data-point');
      const data = anatomyData[id];
      if (!data) return;

      if (previewImg) previewImg.src = data.image;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;

      if (specsList) {
        specsList.innerHTML = data.specs
          .map(s => `
            <li class="spec-row-item">
              <span class="spec-key">${s.key}</span>
              <span class="spec-val">${s.val}</span>
            </li>
          `)
          .join('');
      }

      if (window.glozaAudio) window.glozaAudio.playClick();
    });
  });
}

/* ==========================================================================
   6. SNEAKER CATALOG (HEEPZY STYLE PRODUCT CARDS)
   ========================================================================== */
const SNEAKERS = [
  {
    id: 'bxr-dunk',
    title: 'Nike SB Dunk Low x Born x Raised',
    subtitle: '"One Block at a Time"',
    brand: 'Nike SB',
    category: 'dunk',
    price: 780,
    badge: 'FEATURED DROP',
    badgeType: 'badge-featured',
    condition: 'Deadstock / OG All',
    image: 'assets/born-x-raised-poster.jpg',
    gallery: [
      'assets/born-x-raised-poster.jpg',
      'assets/born-x-raised-side.jpg',
      'assets/born-x-raised-sole.jpg',
      'assets/born-x-raised-heel.jpg',
      'assets/born-x-raised-laces.jpg',
      'assets/born-x-raised-triptych.jpg'
    ],
    sizes: ['US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'],
    desc: 'The official grail collaborative Dunk Low honoring Los Angeles street culture. Includes iridescent holographic swoosh, "In Loving Memory" fat laces, and "ON THE TURF" embossed midsole. Vacuum sealed in GLOZA climate vault.'
  },
  {
    id: 'ja-deepwater',
    title: 'Nike Ja 4 "Deep Water"',
    subtitle: 'Special Player Edition',
    brand: 'Nike Basketball',
    category: 'performance',
    price: 340,
    badge: 'NEW ARRIVAL',
    badgeType: 'badge-hot',
    condition: 'Deadstock / Pristine',
    image: 'assets/ja-deep-water-poster.jpg',
    gallery: [
      'assets/ja-deep-water-poster.jpg',
      'assets/born-x-raised-triptych.jpg'
    ],
    sizes: ['US 9', 'US 9.5', 'US 10', 'US 11', 'US 12'],
    desc: 'High-voltage court performance sneaker with liquid navy mesh upper, metallic midnight reflective accents, and hyper-responsive dual-pod cushioning.'
  },
  {
    id: 'jordan-vault-noir',
    title: 'Air Jordan 1 Retro High OG "Chicago"',
    subtitle: 'Lost & Found Vault Series',
    brand: 'Jordan Brand',
    category: 'jordan',
    price: 490,
    badge: 'VAULT GRAIL',
    badgeType: 'badge-grail',
    condition: 'Deadstock / Factory Sealed',
    image: 'assets/gloza-vault-wall.jpg',
    gallery: [
      'assets/gloza-vault-wall.jpg',
      'assets/born-x-raised-side.jpg'
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 10.5', 'US 11.5'],
    desc: 'The defining silhouette of modern sneaker reselling. Aged vintage crackled leather collars, muslin tongue, and authenticated archival packaging.'
  },
  {
    id: 'travis-reverse-mocha',
    title: 'Travis Scott x Air Jordan 1 Low OG',
    subtitle: '"Reverse Mocha"',
    brand: 'Jordan Brand',
    category: 'collab',
    price: 1250,
    badge: 'HYPE ICON',
    badgeType: 'badge-grail',
    condition: 'Deadstock / Verified',
    image: 'assets/born-x-raised-triptych.jpg',
    gallery: [
      'assets/born-x-raised-triptych.jpg',
      'assets/born-x-raised-side.jpg'
    ],
    sizes: ['US 9', 'US 9.5', 'US 10', 'US 10.5'],
    desc: 'Signature reverse oversized cream swoosh on rich espresso nubuck and white sail tumbled leather overlays. Comes with all four pairs of waxed laces.'
  },
  {
    id: 'bxr-side-grail',
    title: 'Nike SB Dunk Born x Raised "Spanto"',
    subtitle: 'Friends & Family Edition',
    brand: 'Nike SB',
    category: 'dunk',
    price: 890,
    badge: 'MUSEUM TIER',
    badgeType: 'badge-featured',
    condition: 'Deadstock / Unworn',
    image: 'assets/born-x-raised-side.jpg',
    gallery: [
      'assets/born-x-raised-side.jpg',
      'assets/born-x-raised-heel.jpg',
      'assets/born-x-raised-sole.jpg'
    ],
    sizes: ['US 9.5', 'US 10', 'US 10.5'],
    desc: 'Ultra-scarce pair with laser embroidered side motifs and custom holographic heel badge. Verified on 12 security checkpoints by GLOZA head authenticators.'
  },
  {
    id: 'jordan-wall-pack',
    title: 'Air Jordan 1 High 85 "Black White"',
    subtitle: 'Archival Vault Certified',
    brand: 'Jordan Brand',
    category: 'jordan',
    price: 410,
    badge: 'ARCHIVAL',
    badgeType: 'badge-vault',
    condition: 'Deadstock / 1985 Cut',
    image: 'assets/gloza-vault-wall.jpg',
    gallery: [
      'assets/gloza-vault-wall.jpg'
    ],
    sizes: ['US 8.5', 'US 9', 'US 10', 'US 11'],
    desc: 'Engineered strictly to original 1985 blueprint specifications with higher ankle collar, premium heavy gauge leather, and vintage hangtag.'
  }
];

function initCatalog() {
  const grid = document.getElementById('sneaker-grid');
  const filterBtns = document.querySelectorAll('.cat-pill-btn, .filter-btn');
  const searchInput = document.getElementById('catalog-search');

  let currentCategory = 'all';
  let searchQuery = '';

  function renderGrid() {
    if (!grid) return;

    const filtered = SNEAKERS.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">NO MATCHING GRAILS FOUND</p>
          <p style="font-size: 0.9rem; margin-top: 6px;">Try adjusting your search query or filter tags.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map(item => `
        <div class="sneaker-card" data-id="${item.id}">
          <div class="card-header-bar">
            <span class="tag-badge ${item.badgeType}">${item.badge}</span>
            <button class="card-wishlist-toggle" aria-label="Add to Wishlist" onclick="toggleWishlist(event, '${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div class="card-thumbnail-stage">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="card-hover-actions">
              <button class="btn-quick-preview" onclick="openQuickView('${item.id}')">QUICK VIEW</button>
            </div>
          </div>

          <div class="card-brand-caption">${item.brand}</div>
          <h3 class="card-product-title">${item.title}</h3>
          
          <div class="card-condition-info">
            <span class="condition-tag-green">● ${item.condition}</span>
            <span>• ${item.subtitle}</span>
          </div>

          <div class="card-size-chips-row">
            ${item.sizes
              .map((s, idx) => `<button class="size-pill-option ${idx === 0 ? 'selected' : ''}" onclick="selectSize(event, this)">${s}</button>`)
              .join('')}
          </div>

          <div class="card-footer-action-bar">
            <div class="card-price-display">
              <span class="price-micro-label">MARKET PRICE</span>
              <span class="price-hero-amount">$${item.price.toLocaleString()}</span>
            </div>
            <button class="btn-card-acquire" onclick="addToCartFromCard('${item.id}')">ADD TO BAG</button>
          </div>
        </div>
      `)
      .join('');
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderGrid();
      if (window.glozaAudio) window.glozaAudio.playClick();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderGrid();
    });
  }

  renderGrid();
}

function selectSize(event, chip) {
  event.stopPropagation();
  const parent = chip.closest('.card-size-chips-row');
  if (parent) {
    parent.querySelectorAll('.size-pill-option').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    if (window.glozaAudio) window.glozaAudio.playClick();
  }
}

function toggleWishlist(event, id) {
  event.stopPropagation();
  const btn = event.currentTarget;
  btn.classList.toggle('active');
  const svg = btn.querySelector('svg');
  if (btn.classList.contains('active')) {
    svg.setAttribute('fill', 'currentColor');
  } else {
    svg.setAttribute('fill', 'none');
  }
  if (window.glozaAudio) window.glozaAudio.playClick();
}

/* ==========================================================================
   7. CONSIGN & RESELL CALCULATOR
   ========================================================================== */
function initCalculator() {
  const modelSelect = document.getElementById('calc-model');
  const condBtns = document.querySelectorAll('.cond-choice-btn, .cond-btn');
  const instantVal = document.getElementById('instant-payout-val');
  const consignVal = document.getElementById('consign-payout-val');

  let basePrice = 780;
  let multiplier = 1.0;

  function updatePayouts() {
    if (!instantVal || !consignVal) return;
    const instant = Math.round(basePrice * multiplier * 0.86);
    const consign = Math.round(basePrice * multiplier * 0.94);

    instantVal.textContent = `$${instant.toLocaleString()}`;
    consignVal.textContent = `$${consign.toLocaleString()}`;
  }

  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      basePrice = parseFloat(e.target.value) || 500;
      updatePayouts();
      if (window.glozaAudio) window.glozaAudio.playClick();
    });
  }

  condBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      condBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      multiplier = parseFloat(btn.getAttribute('data-mult') || '1.0');
      updatePayouts();
      if (window.glozaAudio) window.glozaAudio.playClick();
    });
  });

  const submitBtn = document.getElementById('btn-submit-consign');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      alert('Your sneaker consignment estimate has been confirmed! A GLOZA concierge will contact you via WhatsApp/Email with prepaid insured courier labels.');
      if (window.glozaAudio) window.glozaAudio.playSuccess();
    });
  }

  updatePayouts();
}

/* ==========================================================================
   8. NFC AUTHENTICITY SCANNER SIMULATOR
   ========================================================================== */
function initScanner() {
  const input = document.getElementById('scanner-tag-input');
  const btn = document.getElementById('btn-run-scan');
  const laser = document.getElementById('scanner-laser');
  const display = document.getElementById('scanner-display-content');

  if (!btn || !laser || !display) return;

  btn.addEventListener('click', () => {
    const code = (input ? input.value : '').trim() || 'GLZ-BXR-7721';
    laser.classList.add('scanning');
    display.innerHTML = `
      <div style="font-family: var(--font-heading); color: var(--brand-blue);">
        <p style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">VERIFYING CRYPTOGRAPHIC NFC TAG...</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Querying GLOZA Vault Ledger // Node #409</p>
      </div>
    `;

    if (window.glozaAudio) window.glozaAudio.playScan();

    setTimeout(() => {
      laser.classList.remove('scanning');
      display.innerHTML = `
        <div style="text-align: center;">
          <div class="verified-stamp-clean">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            100% VAULT AUTHENTICATED
          </div>
          <p style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); font-weight: 800;">
            Nike SB Dunk Low x Born x Raised
          </p>
          <div class="cert-meta-grid">
            <div><span class="spec-key">TAG SERIAL:</span> <span class="spec-val">${code}</span></div>
            <div><span class="spec-key">INSPECTOR:</span> <span class="spec-val">GLZ-AUTH #09 (PASSED)</span></div>
            <div><span class="spec-key">VERIFIED DATE:</span> <span class="spec-val">NOVEMBER 2026</span></div>
            <div><span class="spec-key">LEDGER PROOF:</span> <span class="spec-val">0x89f2b...c38e</span></div>
          </div>
        </div>
      `;
      if (window.glozaAudio) window.glozaAudio.playSuccess();
    }, 1200);
  });
}

/* ==========================================================================
   9. CART DRAWER & CHECKOUT
   ========================================================================== */
let cart = [
  {
    id: 'bxr-dunk',
    title: 'Nike SB Dunk Low x Born x Raised',
    size: 'US 10',
    price: 780,
    image: 'assets/born-x-raised-poster.jpg',
    qty: 1
  }
];

let appliedDiscount = 0;

function initCartDrawer() {
  const triggerBtn = document.getElementById('cart-trigger-btn');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close-btn');
  const couponInput = document.getElementById('coupon-input');
  const couponBtn = document.getElementById('btn-apply-coupon');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (triggerBtn && overlay) {
    triggerBtn.addEventListener('click', () => {
      overlay.classList.add('open');
      renderCart();
      if (window.glozaAudio) window.glozaAudio.playClick();
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      if (window.glozaAudio) window.glozaAudio.playClick();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  if (couponBtn && couponInput) {
    couponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'GLOZA10') {
        appliedDiscount = 0.10;
        alert('Promo code GLOZA10 applied: 10% discount granted!');
        renderCart();
        if (window.glozaAudio) window.glozaAudio.playSuccess();
      } else {
        alert('Invalid or expired coupon code. Try code: GLOZA10');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your shopping bag is empty.');
        return;
      }
      openOrderCelebration();
    });
  }

  renderCart();
}

function renderCart() {
  const itemsContainer = document.getElementById('cart-items-list');
  const countBadge = document.getElementById('cart-badge-count');
  const subtotalVal = document.getElementById('cart-subtotal');
  if (!itemsContainer) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = totalItems;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <p style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">YOUR BAG IS EMPTY</p>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Explore the vault and add grails to your bag.</p>
      </div>
    `;
    if (subtotalVal) subtotalVal.textContent = '$0';
    return;
  }

  let rawTotal = 0;

  itemsContainer.innerHTML = cart
    .map((item, idx) => {
      rawTotal += item.price * item.qty;
      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div>
            <h4 class="cart-item-name">${item.title}</h4>
            <div class="cart-item-specs">Size: ${item.size} • Qty: ${item.qty}</div>
            <div class="cart-item-price-tag">$${(item.price * item.qty).toLocaleString()}</div>
          </div>
          <button class="cart-item-trash-btn" onclick="removeCartItem(${idx})" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
    })
    .join('');

  const finalTotal = Math.round(rawTotal * (1 - appliedDiscount));
  if (subtotalVal) {
    subtotalVal.textContent = `$${finalTotal.toLocaleString()}${appliedDiscount > 0 ? ' (10% OFF)' : ''}`;
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
  if (window.glozaAudio) window.glozaAudio.playClick();
}

function addToCartFromCard(shoeId) {
  const shoe = SNEAKERS.find(s => s.id === shoeId);
  if (!shoe) return;

  const card = document.querySelector(`.sneaker-card[data-id="${shoeId}"]`);
  let selectedSize = shoe.sizes[0];
  if (card) {
    const sel = card.querySelector('.size-pill-option.selected');
    if (sel) selectedSize = sel.textContent.trim();
  }

  const existing = cart.find(c => c.id === shoeId && c.size === selectedSize);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: shoe.id,
      title: shoe.title,
      size: selectedSize,
      price: shoe.price,
      image: shoe.image,
      qty: 1
    });
  }

  renderCart();
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.add('open');
  if (window.glozaAudio) window.glozaAudio.playSuccess();
}

function openOrderCelebration() {
  const overlay = document.getElementById('order-success-modal');
  if (overlay) {
    overlay.classList.add('open');
    if (window.glozaAudio) window.glozaAudio.playSuccess();
  }
}

function closeOrderCelebration() {
  const overlay = document.getElementById('order-success-modal');
  if (overlay) overlay.classList.remove('open');
  cart = [];
  renderCart();
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.classList.remove('open');
}

/* ==========================================================================
   10. QUICK VIEW & MULTI-ANGLE MODAL
   ========================================================================== */
let activeQuickShoe = null;

function initQuickViewModal() {
  const overlay = document.getElementById('quickview-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      if (window.glozaAudio) window.glozaAudio.playClick();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  // Interactive Zoom Lens on Quickview Image
  const qvImgBox = document.querySelector('.modal-big-img-box');
  const qvImg = document.getElementById('qv-main-img');
  if (qvImgBox && qvImg) {
    qvImgBox.addEventListener('mousemove', (e) => {
      const rect = qvImgBox.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      qvImg.style.transformOrigin = `${x}% ${y}%`;
      qvImg.style.transform = 'scale(1.6)';
    });

    qvImgBox.addEventListener('mouseleave', () => {
      qvImg.style.transformOrigin = 'center center';
      qvImg.style.transform = 'scale(1)';
    });
  }
}

function openQuickView(shoeId) {
  const shoe = SNEAKERS.find(s => s.id === shoeId);
  if (!shoe) return;
  activeQuickShoe = shoe;

  const overlay = document.getElementById('quickview-modal');
  const mainImg = document.getElementById('qv-main-img');
  const thumbsRow = document.getElementById('qv-thumbs-row');
  const brandEl = document.getElementById('qv-brand');
  const titleEl = document.getElementById('qv-title');
  const priceEl = document.getElementById('qv-price');
  const descEl = document.getElementById('qv-desc');
  const sizesRow = document.getElementById('qv-sizes-row');

  if (mainImg) mainImg.src = shoe.gallery[0];
  if (brandEl) brandEl.textContent = shoe.brand;
  if (titleEl) titleEl.textContent = `${shoe.title} ${shoe.subtitle}`;
  if (priceEl) priceEl.textContent = `$${shoe.price.toLocaleString()} USD`;
  if (descEl) descEl.textContent = shoe.desc;

  if (thumbsRow) {
    thumbsRow.innerHTML = shoe.gallery
      .map((img, i) => `
        <img src="${img}" class="modal-thumb-item ${i === 0 ? 'active' : ''}" onclick="switchQuickViewImg(this, '${img}')" alt="angle thumbnail">
      `)
      .join('');
  }

  if (sizesRow) {
    sizesRow.innerHTML = shoe.sizes
      .map((s, idx) => `<button class="size-pill-option ${idx === 0 ? 'selected' : ''}" onclick="selectSize(event, this)">${s}</button>`)
      .join('');
  }

  if (overlay) overlay.classList.add('open');
  if (window.glozaAudio) window.glozaAudio.playClick();
}

function switchQuickViewImg(thumb, src) {
  const mainImg = document.getElementById('qv-main-img');
  if (mainImg) mainImg.src = src;
  const parent = thumb.parentElement;
  if (parent) {
    parent.querySelectorAll('.modal-thumb-item').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }
  if (window.glozaAudio) window.glozaAudio.playClick();
}

function addFromQuickView() {
  if (!activeQuickShoe) return;
  const sizesRow = document.getElementById('qv-sizes-row');
  let chosenSize = activeQuickShoe.sizes[0];
  if (sizesRow) {
    const sel = sizesRow.querySelector('.size-pill-option.selected');
    if (sel) chosenSize = sel.textContent.trim();
  }

  const existing = cart.find(c => c.id === activeQuickShoe.id && c.size === chosenSize);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: activeQuickShoe.id,
      title: activeQuickShoe.title,
      size: chosenSize,
      price: activeQuickShoe.price,
      image: activeQuickShoe.gallery[0],
      qty: 1
    });
  }

  renderCart();
  const qv = document.getElementById('quickview-modal');
  if (qv) qv.classList.remove('open');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.classList.add('open');
  if (window.glozaAudio) window.glozaAudio.playSuccess();
}

// Global exposure
window.openQuickView = openQuickView;
window.switchQuickViewImg = switchQuickViewImg;
window.addFromQuickView = addFromQuickView;
window.selectSize = selectSize;
window.toggleWishlist = toggleWishlist;
window.addToCartFromCard = addToCartFromCard;
window.removeCartItem = removeCartItem;
window.closeOrderCelebration = closeOrderCelebration;

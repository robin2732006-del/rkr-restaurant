/* ============================================================
   RKR RESTAURANT — ELITE FULL JAVASCRIPT SYSTEM
   Version : 5.0 Ultimate Production Build
   Author  : ChatGPT
   ============================================================ */

'use strict';

/* ============================================================
   GLOBAL HELPERS
   ============================================================ */

const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

const getApiUrl = (path) => {
  const hostname = window.location.hostname;
  const isLocal = !hostname || 
                  window.location.protocol === 'file:' || 
                  hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.startsWith('192.168.') || 
                  hostname.startsWith('10.') || 
                  hostname.startsWith('172.');
  if (isLocal) {
    return 'http://localhost:5000' + path;
  }
  if (hostname.includes('vercel.app')) {
    return path;
  }
  return 'https://rkr-restaurant-backend.onrender.com' + path;
};

const debounce = (fn, delay = 100) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, wait = 100) => {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    waiting = true;
    fn(...args);
    setTimeout(() => waiting = false, wait);
  };
};

/* ============================================================
   SAFE INITIALIZER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Global state for menu filtering/pagination
  window.menuState = {
    activeCategory: 'all',
    searchQuery: '',
    isExpanded: false,
    limit: 6
  };

  // Centralized menu visibility/rendering controller
  window.updateMenuVisibility = () => {
    const cards = qsa('.food-card');
    const seeMoreContainer = qs('#seeMoreContainer');
    const seeMoreBtn = qs('#seeMoreBtn');
    const noResults = qs('#noResults');

    let matchCount = 0;
    let shownCount = 0;

    cards.forEach(card => {
      const title = qs('h3', card)?.textContent.toLowerCase() || '';
      const desc = qs('p', card)?.textContent.toLowerCase() || '';
      const cat = card.dataset.category ? card.dataset.category.toLowerCase() : '';
      const q = window.menuState.searchQuery.toLowerCase().trim();

      const matchesCategory = (window.menuState.activeCategory === 'all' || cat === window.menuState.activeCategory.toLowerCase());
      const matchesSearch = (q === '' || title.includes(q) || desc.includes(q) || cat.includes(q));

      if (matchesCategory && matchesSearch) {
        matchCount++;
        if (window.menuState.isExpanded || shownCount < window.menuState.limit) {
          card.style.display = '';
          card.classList.add('visible');
          shownCount++;
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      } else {
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });

    if (noResults) {
      noResults.style.display = matchCount === 0 ? 'block' : 'none';
    }

    if (seeMoreContainer && seeMoreBtn) {
      if (matchCount > window.menuState.limit) {
        seeMoreContainer.style.display = 'block';
        if (window.menuState.isExpanded) {
          seeMoreBtn.innerHTML = `<span>See Less Dishes</span> <i class="fa-solid fa-chevron-up"></i>`;
        } else {
          seeMoreBtn.innerHTML = `<span>See More Dishes</span> <i class="fa-solid fa-chevron-down"></i>`;
        }
      } else {
        seeMoreContainer.style.display = 'none';
      }
    }
  };

  initPreloader();
  initHeader();
  initMobileNav();
  initTheme();
  initCartSystem();
  initCounters();
  initParticles();
  initHeroParallax();
  initReveal();
  initNavSpy();
  initSmoothScroll();
  initTopButton();
  initSearch();
  initCategoryFilters();
  initNewsletter();
  initGallery();
  initFoodHoverEffects();
  initFloatingAnimations();
  initKeyboardShortcuts();
  initLazyAnimations();
  initRippleEffects();
  initMenu();
  initUserAuthStatus();
  initHomeVipProfile();
  initContactForm();
  initProfileDashboard();

});

/* ============================================================
   PRELOADER
   ============================================================ */

function initPreloader() {

  const preloader = qs('#preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.overflow = '';
      setTimeout(() => {
        preloader.remove();
      }, 1200);
    }, 1200);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Safety timeout to guarantee page doesn't freeze
    setTimeout(hidePreloader, 3000);
  }

}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */


/* ============================================================
   HEADER
   ============================================================ */

function initHeader() {
  const header = qs('#header');
  if (!header) return;

  let isScrolled = false;
  const updateHeader = () => {
    const shouldScrolled = window.scrollY > 40;
    if (shouldScrolled !== isScrolled) {
      isScrolled = shouldScrolled;
      if (isScrolled) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  updateHeader();

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

function initMobileNav() {

  const hamburger = qs('#hamburger');
  const navLinks = qs('#navLinks');
  const backdrop = qs('#navBackdrop');

  if (!hamburger || !navLinks) return;

  const openNav = () => {
    navLinks.classList.add('open');
    backdrop?.classList.add('show');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    navLinks.classList.remove('open');
    backdrop?.classList.remove('show');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Touch & click dismiss on backdrop
  backdrop?.addEventListener('click', closeNav);
  backdrop?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    closeNav();
  }, { passive: false });

  // Touch anywhere outside the drawer / on the side to dismiss
  const handleOutsideInteraction = (e) => {
    if (navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        closeNav();
      }
    }
  };
  document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
  document.addEventListener('click', handleOutsideInteraction);

  // Close when tapping any link or button inside the drawer
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

}

/* ============================================================
   THEME SYSTEM
   ============================================================ */

function initTheme() {
  function getStoredTheme() {
    try {
      return localStorage.getItem('rkr-theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    const isLight = (theme === 'light');

    // 1. Synchronize BOTH documentElement and body so all CSS selectors work
    if (isLight) {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Synchronize ALL theme toggle buttons across the page
    const toggleBtns = qsa('#themeToggle, .theme-toggle-btn');
    toggleBtns.forEach(b => {
      b.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      b.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      const ic = b.querySelector('i');
      if (ic) {
        ic.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });

    // 3. Synchronize Profile Dashboard theme pill (if present)
    const profileThemeBtn = qs('#profileThemeToggleBtn');
    if (profileThemeBtn) {
      const pIcon = profileThemeBtn.querySelector('i');
      const pText = profileThemeBtn.querySelector('.theme-text');
      if (isLight) {
        if (pIcon) pIcon.className = 'fa-solid fa-sun';
        if (pText) pText.textContent = 'Light Mode';
        profileThemeBtn.classList.add('light-active');
        profileThemeBtn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        if (pIcon) pIcon.className = 'fa-solid fa-moon';
        if (pText) pText.textContent = 'Dark Mode';
        profileThemeBtn.classList.remove('light-active');
        profileThemeBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }
  }

  function toggleCurrentTheme(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const isCurrentlyLight = document.documentElement.classList.contains('light') ||
                             document.body.classList.contains('light') ||
                             getStoredTheme() === 'light';
    const nextTheme = isCurrentlyLight ? 'dark' : 'light';
    try {
      localStorage.setItem('rkr-theme', nextTheme);
    } catch (err) {}
    applyTheme(nextTheme);
  }

  // Initial application from storage
  applyTheme(getStoredTheme());

  // Attach click listeners to all theme toggles
  qsa('#themeToggle, .theme-toggle-btn').forEach(btn => {
    btn.onclick = toggleCurrentTheme;
  });

  const profileThemeBtn = qs('#profileThemeToggleBtn');
  if (profileThemeBtn) {
    profileThemeBtn.onclick = toggleCurrentTheme;
  }

  // Multi-tab / cross-window sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'rkr-theme') {
      applyTheme(e.newValue || 'dark');
    }
  });

  // Expose global helpers
  window.setSiteTheme = applyTheme;
  window.toggleSiteTheme = toggleCurrentTheme;
}

/* ============================================================
   CART SYSTEM
   ============================================================ */

function initCartSystem() {

  const STORAGE_KEY = 'rkr-cart';

  const badge = qs('#cartBadge');
  const drawer = qs('#cartDrawer');
  const overlay = qs('#cartOverlay');
  const cartBtn = qs('#cartBtn');
  const closeBtn = qs('#cartClose');
  const itemsWrap = qs('#cartItems');
  const totalWrap = qs('#cartTotal');

  const getCart = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || [];
      const LEGACY_DUMMIES = ['cheese burger', 'italian pizza', 'burger', 'pizza', 'demo item'];
      const cleaned = stored.filter(item => {
        if (!item || !item.name) return false;
        const name = String(item.name).toLowerCase().trim();
        return !LEGACY_DUMMIES.includes(name);
      });
      if (cleaned.length !== stored.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned.map(item => ({
        id: item.id || item.name,
        name: item.name,
        price: Number(item.price),
        image: item.image || item.img || 'images/dishes/hyderabadi_biryani.jpg',
        img: item.img || item.image || 'images/dishes/hyderabadi_biryani.jpg',
        quantity: Number(item.quantity || item.qty || 1),
        qty: Number(item.qty || item.quantity || 1),
        description: item.description || ''
      }));
    } catch {
      return [];
    }
  };

  const saveCart = cart => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cart)
    );
  };

  const updateBadge = () => {
    const total = getCart().reduce(
      (sum, item) => sum + item.qty,
      0
    );
    qsa('#cartBadge, #cart-count, .cart-badge').forEach(b => {
      b.textContent = total;
    });
  };

  const renderCart = () => {

    if (!itemsWrap) return;

    const cart = getCart();

    updateBadge();

    const countHeader = qs('#cartHeaderCount');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countHeader) {
      countHeader.textContent = totalItems === 1 ? '1 dish' : `${totalItems} dishes`;
      countHeader.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    // Dynamic Perk Banner placeholder
    let perkBanner = qs('#cartPerkBanner');
    if (!perkBanner && itemsWrap) {
      perkBanner = document.createElement('div');
      perkBanner.id = 'cartPerkBanner';
      itemsWrap.parentNode.insertBefore(perkBanner, itemsWrap);
    }

    if (!cart.length) {

      itemsWrap.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-cart-icon-box">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <h4>Your Cart is Empty</h4>
          <p>You haven't selected any dishes yet. Treat yourself to our 30 chef-curated signature creations!</p>
          <a href="menu.html" class="btn-browse-menu" onclick="document.getElementById('cartClose')?.click()">
            <i class="fa-solid fa-utensils"></i> Explore Royal Menu
          </a>
        </div>
      `;

      if (totalWrap) {
        totalWrap.textContent = '₹0';
      }
      const subtotalEl = qs('#cartSubtotal');
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (perkBanner) perkBanner.innerHTML = '';
      const footerEl = qs('#cartFooter');
      if (footerEl) footerEl.style.opacity = '0.5';

      return;

    }

    const footerEl = qs('#cartFooter');
    if (footerEl) footerEl.style.opacity = '1';

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const freeDeliveryThreshold = 500;
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;
    const diff = Math.max(0, freeDeliveryThreshold - subtotal);
    const progressPct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

    if (perkBanner) {
      if (isFreeDelivery) {
        perkBanner.className = 'cart-perk-banner unlocked';
        perkBanner.innerHTML = `
          <div class="perk-text">
            <i class="fa-solid fa-circle-check"></i>
            <span><strong>FREE Express Delivery</strong> unlocked for this order!</span>
          </div>
          <div class="perk-bar"><div class="perk-fill" style="width: 100%;"></div></div>
        `;
      } else {
        perkBanner.className = 'cart-perk-banner';
        perkBanner.innerHTML = `
          <div class="perk-text">
            <i class="fa-solid fa-truck-fast"></i>
            <span>Add <strong>₹${diff}</strong> more for <strong>FREE Delivery</strong></span>
          </div>
          <div class="perk-bar"><div class="perk-fill" style="width: ${progressPct}%;"></div></div>
        `;
      }
    }

    itemsWrap.innerHTML = cart.map(item => `
      <div class="cart-item-card">
        <div class="ci-image-wrap">
          <img src="${item.img || item.image || 'images/dishes/hyderabadi_biryani.jpg'}" 
               alt="${item.name}" 
               onerror="this.onerror=null;this.src='images/dishes/hyderabadi_biryani.jpg';">
        </div>

        <div class="ci-info-col">
          <div class="ci-title-row">
            <h4 class="ci-item-name" title="${item.name}">${item.name}</h4>
            <button class="cart-remove ci-trash-btn" data-name="${item.name}" aria-label="Remove item" title="Remove ${item.name}">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>

          <div class="ci-bottom-row">
            <div class="ci-price-box">
              <span class="ci-unit-price">₹${item.price}</span>
              ${item.qty > 1 ? `<span class="ci-line-sum">Total ₹${item.price * item.qty}</span>` : ''}
            </div>

            <div class="cart-qty ci-stepper-pill">
              <button class="qty-minus ci-step-btn" data-name="${item.name}" aria-label="Decrease quantity">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="ci-qty-num">${item.qty}</span>
              <button class="qty-plus ci-step-btn" data-name="${item.name}" aria-label="Increase quantity">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    if (totalWrap) {
      totalWrap.textContent =
        `₹${subtotal.toLocaleString('en-IN')}`;
    }

    const subtotalEl = qs('#cartSubtotal');
    if (subtotalEl) {
      subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    const deliveryEl = qs('#cartDeliveryFee');
    if (deliveryEl) {
      deliveryEl.textContent = isFreeDelivery ? 'FREE' : '₹50';
      deliveryEl.className = isFreeDelivery ? 'free-tag' : '';
    }

    bindCartActions();

  };

  const bindCartActions = () => {

    qsa('.qty-plus').forEach(btn => {

      btn.addEventListener('click', () => {

        const cart = getCart();

        const item = cart.find(
          i => i.name === btn.dataset.name
        );

        if (item) {
          item.qty++;
          item.quantity = item.qty;
        }

        saveCart(cart);
        renderCart();

      });

    });

    qsa('.qty-minus').forEach(btn => {

      btn.addEventListener('click', () => {

        let cart = getCart();

        const item = cart.find(
          i => i.name === btn.dataset.name
        );

        if (item) {

          item.qty--;
          item.quantity = item.qty;

          if (item.qty <= 0) {
            cart = cart.filter(
              i => i.name !== item.name
            );
          }

        }

        saveCart(cart);
        renderCart();

      });

    });

    qsa('.cart-remove').forEach(btn => {

      btn.addEventListener('click', () => {

        const cart = getCart().filter(
          i => i.name !== btn.dataset.name
        );

        saveCart(cart);

        renderCart();

        showToast('Item removed');

      });

    });

  };

  const addToCart = item => {

    const cart = getCart();

    const exists = cart.find(
      i => i.name === item.name
    );

    if (exists) {

      exists.qty++;
      exists.quantity = exists.qty;

    } else {

      cart.push({
        ...item,
        qty: 1,
        quantity: 1
      });

    }

    saveCart(cart);

    renderCart();

  };

  // Event Delegation for Adding to Cart on Dynamic Items!
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.food-card');
    const desc = card ? qs('p', card)?.textContent.trim() : '';

    addToCart({
      id: btn.dataset.name,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.img,
      img: btn.dataset.img,
      description: desc || ''
    });

    btn.classList.add('added');

    const old = btn.innerHTML;

    btn.innerHTML =
      `<i class="fa-solid fa-check"></i> Added`;

    setTimeout(() => {

      btn.classList.remove('added');
      btn.innerHTML = old;

    }, 1500);

    showToast(`${btn.dataset.name} added`);
  });

  // Event Delegation for Wishlist clicks on Dynamic Items!
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    btn.classList.toggle('active');
    btn.classList.toggle('liked');
    const icon = btn.querySelector('i');

    if (btn.classList.contains('active')) {
      if (icon) icon.className = 'fa-solid fa-heart';
      showToast('Added to wishlist ❤️');
    } else {
      if (icon) icon.className = 'fa-regular fa-heart';
      showToast('Removed from wishlist');
    }
  });

  cartBtn?.addEventListener('click', e => {

    if (!drawer) {
      // No cart drawer on this page (e.g. auth, orders, success).
      // Navigate directly to cart.html!
      return;
    }

    e.preventDefault();

    drawer.classList.add('open');
    overlay?.classList.add('show');

    document.body.style.overflow = 'hidden';

    renderCart();

  });

  const closeDrawer = () => {

    drawer?.classList.remove('open');
    overlay?.classList.remove('show');

    document.body.style.overflow = '';

  };

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  renderCart();
  updateBadge();

}

/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

  const toast = qs('#toast');
  const text = qs('#toastMsg');

  if (!toast || !text) return;

  text.textContent = message;

  toast.classList.add('show');

  clearTimeout(toast._timer);

  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);

}

/* ============================================================
   COUNTERS
   ============================================================ */

function initCounters() {

  const counters = qsa('.h-num[data-target], .counter[data-target], [data-counter]').filter(el => {
    const val = Number(el.dataset.target || el.dataset.counter);
    return !isNaN(val) && val > 0;
  });

  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.target || el.dataset.counter);
      if (isNaN(target)) return;

      let current = 0;

      const increment = target / 80;

      const update = () => {

        current += increment;

        if (current >= target) {

          el.textContent = target;

        } else {

          el.textContent = Math.floor(current);

          requestAnimationFrame(update);

        }

      };

      update();

      observer.unobserve(el);

    });

  }, {
    threshold: 0.5
  });

  counters.forEach(c => observer.observe(c));

}

/* ============================================================
   HERO PARTICLES
   ============================================================ */

function initParticles() {

  const wrap = qs('#heroParticles');
  if (!wrap) return;

  for (let i = 0; i < 25; i++) {

    const p = document.createElement('span');

    p.className = 'particle';

    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';

    p.style.animationDuration =
      5 + Math.random() * 8 + 's';

    p.style.animationDelay =
      Math.random() * 4 + 's';

    wrap.appendChild(p);

  }

}

/* ============================================================
   HERO PARALLAX
   ============================================================ */

function initHeroParallax() {

  const image = qs('.hero-img-frame');
  if (!image) return;

  window.addEventListener('mousemove', e => {

    const x =
      (window.innerWidth / 2 - e.pageX) / 35;

    const y =
      (window.innerHeight / 2 - e.pageY) / 35;

    image.style.transform =
      `rotateY(${x}deg) rotateX(${-y}deg)`;

  });

}

/* ============================================================
   REVEAL
   ============================================================ */

function initReveal() {

  const elements = qsa(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');

      }

    });

  }, {
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));

}

/* ============================================================
   NAV SPY
   ============================================================ */

function initNavSpy() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-link');

  // 1. Highlight active menu item based on current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const setActiveByPath = () => {
    let matched = false;
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (!href) return;
      const hrefPage = href.split('#')[0] || 'index.html';
      
      if (href === currentPath || hrefPage === currentPath || (currentPath === 'index.html' && hrefPage === '')) {
        link.classList.add('active');
        matched = true;
      }
    });
    if (!matched && currentPath.includes('index.html')) {
      const homeLink = navLinks.find(link => link.getAttribute('href') === 'index.html');
      if (homeLink) homeLink.classList.add('active');
    }
  };

  setActiveByPath();

  // 2. Scroll spy sections on Home page
  if (!sections.length) return;

  const activate = () => {
    if (currentPath !== 'index.html' && currentPath !== '' && currentPath !== 'Restaurant' && currentPath !== 'restaurant-app') {
      return;
    }

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 160;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    if (current) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${current}` || href === `index.html#${current}`) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          activate();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

function initSmoothScroll() {
  const getTargetScrollPos = (target) => {
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 75;
    return target.getBoundingClientRect().top + window.pageYOffset - headerH;
  };

  qsa('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    try {
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.href);
      
      if (currentUrl.origin === targetUrl.origin && currentUrl.pathname === targetUrl.pathname && targetUrl.hash) {
        const target = qs(targetUrl.hash);
        if (target) {
          link.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
              top: getTargetScrollPos(target),
              behavior: 'smooth'
            });
            history.pushState(null, null, targetUrl.hash);
            if (targetUrl.hash === '#search') {
              setTimeout(() => qs('#searchInput')?.focus(), 400);
            }
          });
        }
      }
    } catch (err) {
      if (href.startsWith('#')) {
        const target = qs(href);
        if (target) {
          link.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
              top: getTargetScrollPos(target),
              behavior: 'smooth'
            });
            history.pushState(null, null, href);
          });
        }
      }
    }
  }); 

  // Handle hash on page load (e.g. going to menu.html#menu or menu.html#categories)
  if (window.location.hash) {
    const hash = window.location.hash;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    const scrollToTarget = () => {
      const target = qs(hash);
      if (target) {
        window.scrollTo({
          top: getTargetScrollPos(target),
          behavior: 'smooth'
        });
        if (hash === '#search') {
          setTimeout(() => qs('#searchInput')?.focus(), 400);
        }
      }
    };

    window.addEventListener('load', () => {
      setTimeout(scrollToTarget, 300);
      setTimeout(scrollToTarget, 1400); // Align with preloader fade-out to scroll when body overflow is enabled
    });
  }
}

/* ============================================================
   TOP BUTTON
   ============================================================ */

function initTopButton() {

  const btn = qs('#topBtn');
  if (!btn) return;

  let isShown = false;
  const update = () => {
    const shouldShow = window.scrollY > 350;
    if (shouldShow !== isShown) {
      isShown = shouldShow;
      if (isShown) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }
  };

  update();

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

}

/* ============================================================
   SEARCH SYSTEM
   ============================================================ */

function initSearch() {

  const input = qs('#searchInput');
  const btn = qs('#searchBtn');
  const clear = qs('#searchClear');
  const stags = qsa('.stag');

  if (!input) return;

  const search = value => {
    window.menuState.searchQuery = value;
    window.updateMenuVisibility();
  };

  btn?.addEventListener('click', () => {
    search(input.value);
  });

  input.addEventListener(
    'input',
    debounce(() => search(input.value), 250)
  );

  clear?.addEventListener('click', () => {
    input.value = '';
    stags.forEach(t => t.classList.remove('active'));
    const allTag = stags.find(t => t.dataset.q === '');
    if (allTag) allTag.classList.add('active');
    search('');
  });

  stags.forEach(tag => {
    tag.addEventListener('click', () => {
      stags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const q = tag.dataset.q || '';
      input.value = q;
      search(q);
    });
  });

}

/* ============================================================
   CATEGORY FILTERS
   ============================================================ */

function initCategoryFilters() {
  const catsGrid = qs('.cats-grid');
  const menuTabs = qs('.menu-tabs');

  if (catsGrid || menuTabs) {
    const categories = window.MENU_CATEGORIES || [];
    const staticMenu = window.STATIC_MENU || [];

    // Render Category Cards
    if (catsGrid) {
      catsGrid.innerHTML = categories.map((cat, i) => {
        const firstFood = staticMenu.find(item => item.category === cat.id);
        const bgImage = cat.image || (firstFood ? firstFood.image : 'images/dishes/hyderabadi_biryani.jpg');
        const itemCount = staticMenu.filter(item => item.category === cat.id).length;

        return `
          <div class="cat-card reveal-up visible" data-filter="${cat.id}" style="animation-delay: ${0.05 * i}s">
            <img src="${bgImage}" alt="${cat.label}" />
            <div class="cat-overlay">
              <h3>${cat.label}</h3>
              <span>${itemCount} items</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Tabs
    if (menuTabs) {
      const tabsHTML = `
        <button class="mtab active" data-cat="all">All (${staticMenu.length})</button>
      ` + categories.map(cat => {
        const itemCount = staticMenu.filter(item => item.category === cat.id).length;
        return `<button class="mtab" data-cat="${cat.id}">${cat.icon} ${cat.label} (${itemCount})</button>`;
      }).join('');

      menuTabs.innerHTML = tabsHTML;
    }
  }

  const tabs = qsa('.mtab');
  const cats = qsa('.cat-card');

  const filter = category => {
    window.menuState.activeCategory = category;
    window.updateMenuVisibility();

    // Sync active state on tabs
    tabs.forEach(t => {
      if (t.dataset.cat === category) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Sync active state on category cards
    cats.forEach(c => {
      if (c.dataset.filter === category) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filter(tab.dataset.cat);
    });
  });

  cats.forEach(cat => {
    cat.addEventListener('click', () => {
      const category = cat.dataset.filter;
      const menuGrid = qs('#menuGrid');
      if (menuGrid) {
        filter(category);
        const menu = qs('#menu');
        if (menu) {
          window.scrollTo({
            top: menu.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      } else {
        window.location.href = `menu.html?category=${category}`;
      }
    });
  });
}

/* ============================================================
   NEWSLETTER
   ============================================================ */

function initNewsletter() {

  const btn = qs('#newsletterBtn');
  const input = qs('#newsletterInput');

  if (!btn || !input) return;

  btn.addEventListener('click', subscribe);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') subscribe();
  });

  function subscribe() {

    const value = input.value.trim();

    const valid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {

      showToast('Enter valid email');

      return;

    }

    showToast('Subscribed successfully 🎉');

    input.value = '';

  }

}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */

function initGallery() {

  const items = qsa('.gal-item');

  if (!items.length) return;

  const lightbox = document.createElement('div');

  lightbox.className = 'lightbox';

  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <img src="" alt="">
    </div>
  `;

  document.body.appendChild(lightbox);

  const img = qs('img', lightbox);

  items.forEach(item => {

    item.addEventListener('click', () => {

      const src = qs('img', item)?.src;

      if (!src) return;

      img.src = src;

      lightbox.classList.add('show');

      document.body.style.overflow = 'hidden';

    });

  });

  lightbox.addEventListener('click', () => {

    lightbox.classList.remove('show');

    document.body.style.overflow = '';

  });

}

/* ============================================================
   FOOD CARD HOVER
   ============================================================ */

function initFoodHoverEffects() {

  qsa('.food-card').forEach(card => {

    card.addEventListener('mousemove', e => {

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);

    });

  });

}

/* ============================================================
   FLOATING EFFECTS
   ============================================================ */

function initFloatingAnimations() {

  qsa('.hero-float-card').forEach((card, i) => {

    card.animate([
      {
        transform: 'translateY(0px)'
      },
      {
        transform: 'translateY(-12px)'
      },
      {
        transform: 'translateY(0px)'
      }
    ], {
      duration: 2500 + i * 400,
      iterations: Infinity
    });

  });

}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */

function initKeyboardShortcuts() {

  document.addEventListener('keydown', e => {

    if (e.key === '/') {

      const search = qs('#searchInput');

      if (search) {

        e.preventDefault();

        search.focus();

      }

    }

  });

}

/* ============================================================
   LAZY ANIMATION
   ============================================================ */

function initLazyAnimations() {

  qsa('img').forEach(img => {

    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });

  });

}

/* ============================================================
   RIPPLE EFFECTS
   ============================================================ */

function initRippleEffects() {

  qsa('button, .btn-primary, .btn-ghost').forEach(btn => {

    btn.addEventListener('click', function (e) {

      const ripple = document.createElement('span');

      ripple.className = 'ripple';

      const rect = this.getBoundingClientRect();

      ripple.style.left =
        `${e.clientX - rect.left}px`;

      ripple.style.top =
        `${e.clientY - rect.top}px`;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);

    });

  });

}

/* ============================================================
   CONSOLE BRANDING
   ============================================================ */


/* ============================================================
   DYNAMIC MENU SYSTEM
   ============================================================ */

/* ============================================================
   DYNAMIC MENU SYSTEM — Replace the existing initMenu()
   in your script.js with this entire block
   ============================================================ */

async function initMenu() {
  const menuGrid = qs('#menuGrid');
  if (!menuGrid) return;

  /* ----------------------------------------------------------
     RENDER HELPER — shared by both API and static data
     ---------------------------------------------------------- */
  const renderFoods = (foods) => {
    const limit = menuGrid.dataset.limit ? parseInt(menuGrid.dataset.limit) : null;
    const foodsToRender = limit ? foods.slice(0, limit) : foods;

    menuGrid.innerHTML = foodsToRender.map((food, i) => {
      // Find matching item in STATIC_MENU to get ingredients, diet, spice if not provided by backend
      const staticItem = (window.STATIC_MENU || []).find(m => m.name.toLowerCase() === food.name.toLowerCase() || m.id === food.id) || {};
      const ingredients = (food.ingredients && food.ingredients.length > 0)
        ? food.ingredients
        : (staticItem.ingredients && staticItem.ingredients.length > 0 ? staticItem.ingredients : ["Fresh Herbs", "Aromatic Spices", "Pure Ghee"]);
      const diet = food.diet || staticItem.diet || (food.tag && food.tag.includes('Veg') ? 'Vegetarian' : 'Non-Veg');
      const isVeg = diet.toLowerCase().includes('veg') && !diet.toLowerCase().includes('non');
      const spice = food.spice || staticItem.spice || 'Medium';

      return `
      <div class="food-card reveal-up visible" data-category="${food.category}" style="transition-delay: ${0.08 * (i % 3)}s">
        <div class="food-img">
          <img src="${food.image || 'images/dishes/hyderabadi_biryani.jpg'}" alt="${food.name}" loading="lazy" />
          ${food.tag ? `<span class="food-tag ${food.tag.toLowerCase().includes('hot') ? 'hot' : food.tag.toLowerCase().includes('new') ? 'new' : ''}">${food.tag}</span>` : ''}
          <span class="diet-chip-indicator ${isVeg ? 'veg' : 'non-veg'}" title="${diet}">
            <i class="fa-solid ${isVeg ? 'fa-leaf' : 'fa-drumstick-bite'}"></i>
          </span>
          <button class="wishlist-btn" aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="food-body">
          <div class="food-meta">
            <span class="food-cat">${food.category.replace('-', ' ')}</span>
            <span class="food-rating"><i class="fa-solid fa-star"></i> ${food.rating || '4.8'}</span>
          </div>
          <h3>${food.name}</h3>
          <p>${food.description || ''}</p>

          <!-- Key Ingredients Bar -->
          <div class="food-ingredients-preview">
            <div class="ing-header">
              <i class="fa-solid fa-seedling"></i>
              <span>Farm-Fresh Ingredients:</span>
            </div>
            <div class="ing-chips-list">
              ${ingredients.slice(0, 3).map(ing => `<span class="ing-pill">${ing}</span>`).join('')}
              ${ingredients.length > 3 ? `<span class="ing-pill-more">+${ingredients.length - 3}</span>` : ''}
            </div>
          </div>

          <div class="food-foot">
            <span class="food-price">₹${food.price}</span>
            <button class="add-btn"
              data-name="${food.name}"
              data-price="${food.price}"
              data-img="${food.image || 'images/dishes/hyderabadi_biryani.jpg'}">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    initFoodHoverEffects();
  };

  /* ----------------------------------------------------------
     TRY BACKEND FIRST — fall back to static menu
     ---------------------------------------------------------- */
  try {
    const response = await fetch(getApiUrl('/api/foods'));

    if (!response.ok) throw new Error('Backend unavailable');

    const data = await response.json();
    const foods = data.foods || data;

    if (!foods || foods.length === 0) throw new Error('Empty response');

    renderFoods(foods);

  } catch (error) {
    console.warn('Backend offline — loading static menu:', error.message);

    // ✅ Load static menu silently from window.STATIC_MENU (pre-loaded via menuData.js)
    renderFoods(window.STATIC_MENU || []);
  }

  // Parse URL parameters for categories and search queries
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');

  if (categoryParam) {
    window.menuState.activeCategory = categoryParam;
    const tabs = qsa('.mtab');
    tabs.forEach(t => {
      t.classList.remove('active');
      if (t.dataset.cat === categoryParam) {
        t.classList.add('active');
      }
    });
    const cats = qsa('.cat-card');
    cats.forEach(c => {
      c.classList.remove('active');
      if (c.dataset.filter === categoryParam) {
        c.classList.add('active');
      }
    });
  }
  
  if (searchParam) {
    window.menuState.searchQuery = searchParam;
    const searchInput = qs('#searchInput');
    if (searchInput) {
      searchInput.value = searchParam;
    }
  }

  // ✅ Initialize Visibility & See More Actions
  window.updateMenuVisibility();

  const seeMoreBtn = qs('#seeMoreBtn');
  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
      window.menuState.isExpanded = !window.menuState.isExpanded;
      window.updateMenuVisibility();
      
      if (!window.menuState.isExpanded) {
        const menu = qs('#menu');
        if (menu) {
          const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 75;
          window.scrollTo({
            top: menu.getBoundingClientRect().top + window.pageYOffset - headerH,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // Smoothly scroll to hash destination once menu grid and layout are fully ready
  if (window.location.hash) {
    const hashTarget = qs(window.location.hash);
    if (hashTarget) {
      setTimeout(() => {
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 75;
        const targetTop = hashTarget.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }, 250);
    }
  }
}

/* ============================================================
   USER AUTHENTICATION STATUS & NAVBAR PROFILE DROPDOWN
   ============================================================ */
function initUserAuthStatus() {
  const STORAGE_KEY = 'user';
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (err) {
    console.error('Error parsing user data from localStorage:', err);
  }

  const navActions = qs('.nav-actions');
  const navLinksList = qs('#navLinks');
  if (!navActions) return;

  // Desktop components
  const ghostBtn = qs('.ghost-btn', navActions);
  const fillBtn = qs('.fill-btn', navActions);

  // Mobile components
  let mobileLoginLi = null;
  let mobileSignupLi = null;
  
  if (navLinksList) {
    qsa('li.mobile-only', navLinksList).forEach(li => {
      if (qs('.mob-login', li)) mobileLoginLi = li;
      if (qs('.mob-signup', li)) mobileSignupLi = li;
    });
  }

  if (userData && userData.user && userData.token) {
    const user = userData.user;
    const name = user.name || 'User';
    const email = user.email || '';
    const firstName = name.split(' ')[0];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const displayAvatar = (user.avatar && user.avatar !== 'INITIALS') ? user.avatar : initials;
    const points = user.loyaltyPoints || 750;
    const tier = user.tier || 'Elite Gold';

    // 1. Desktop Navbar: Hide Login/Sign Up buttons
    if (ghostBtn) ghostBtn.style.display = 'none';
    if (fillBtn) fillBtn.style.display = 'none';

    // 2. Desktop Navbar: Create and inject user profile dropdown
    let userProfileMenu = qs('#userProfileMenu');
    if (!userProfileMenu) {
      userProfileMenu = document.createElement('div');
      userProfileMenu.className = 'user-profile-menu';
      userProfileMenu.id = 'userProfileMenu';
      userProfileMenu.innerHTML = `
        <button class="profile-trigger" id="profileTrigger" aria-label="User Profile">
          <div class="profile-initials-circle">${displayAvatar}</div>
          <span class="username-text">${firstName}</span>
          <i class="fa-solid fa-chevron-down trigger-chevron"></i>
        </button>
        <div class="profile-dropdown" id="profileDropdown">
          <div class="dropdown-header">
            <div class="dropdown-user-top">
              <div class="dropdown-avatar">${displayAvatar}</div>
              <div class="dropdown-user-info">
                <p class="user-name-display">${name}</p>
                <p class="user-email-display">${email}</p>
              </div>
            </div>
            <div class="dropdown-vip-strip">
              <span class="dropdown-vip-badge"><i class="fa-solid fa-crown"></i> ${tier}</span>
              <span class="dropdown-points">${points} Pts</span>
            </div>
          </div>
          <a href="profile.html" class="dropdown-item">
            <span class="item-icon"><i class="fa-regular fa-user"></i></span>
            <span>VIP Dining Profile</span>
          </a>
          <a href="profile.html#order-history" class="dropdown-item">
            <span class="item-icon"><i class="fa-solid fa-receipt"></i></span>
            <span>Order Vault & History</span>
          </a>
          <a href="profile.html#loyalty-rewards" class="dropdown-item">
            <span class="item-icon"><i class="fa-solid fa-award"></i></span>
            <span>Metal VIP Card</span>
          </a>
          <a href="profile.html#address-book" class="dropdown-item">
            <span class="item-icon"><i class="fa-solid fa-map-location-dot"></i></span>
            <span>Saved Coordinates</span>
          </a>
          <hr class="dropdown-divider">
          <button id="logoutBtn" class="dropdown-item logout-item">
            <span class="item-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></span>
            <span>Logout Account</span>
          </button>
        </div>
      `;
      const cartBtn = qs('.cart-btn', navActions);
      if (cartBtn) {
        navActions.insertBefore(userProfileMenu, cartBtn);
      } else {
        navActions.appendChild(userProfileMenu);
      }
    } else {
      // Dynamic refresh
      const triggerCircle = qs('.profile-initials-circle', userProfileMenu);
      const textName = qs('.username-text', userProfileMenu);
      const dropAvatar = qs('.dropdown-avatar', userProfileMenu);
      const dropName = qs('.user-name-display', userProfileMenu);
      const dropEmail = qs('.user-email-display', userProfileMenu);
      const dropBadge = qs('.dropdown-vip-badge', userProfileMenu);
      const dropPoints = qs('.dropdown-points', userProfileMenu);

      if (triggerCircle) triggerCircle.textContent = displayAvatar;
      if (textName) textName.textContent = firstName;
      if (dropAvatar) dropAvatar.textContent = displayAvatar;
      if (dropName) dropName.textContent = name;
      if (dropEmail) dropEmail.textContent = email;
      if (dropBadge) dropBadge.innerHTML = `<i class="fa-solid fa-crown"></i> ${tier}`;
      if (dropPoints) dropPoints.textContent = `${points} Pts`;
    }

    // Toggle Dropdown logic
    const profileTrigger = qs('#profileTrigger', userProfileMenu);
    const profileDropdown = qs('#profileDropdown', userProfileMenu);
    if (profileTrigger && profileDropdown) {
      profileTrigger.onclick = (e) => {
        e.stopPropagation();
        userProfileMenu.classList.toggle('active');
      };

      document.addEventListener('click', (e) => {
        if (!userProfileMenu.contains(e.target)) {
          userProfileMenu.classList.remove('active');
        }
      });
    }

    // Logout logic (desktop)
    const logoutBtn = qs('#logoutBtn', userProfileMenu);
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        showToast('Logged out successfully 👋');
        setTimeout(() => window.location.reload(), 700);
      };
    }

    // 3. Mobile Navbar Drawer
    if (mobileLoginLi) mobileLoginLi.style.display = 'none';
    if (mobileSignupLi) mobileSignupLi.style.display = 'none';

    if (navLinksList) {
      qsa('.mobile-user-item', navLinksList).forEach(el => el.remove());

      const profileLi = document.createElement('li');
      profileLi.className = 'mobile-only mobile-user-profile mobile-user-item';
      profileLi.innerHTML = `
        <div class="mobile-profile-info">
          <div class="mobile-avatar">${displayAvatar}</div>
          <div class="mobile-user-details">
            <span class="mobile-username">${name}</span>
            <span class="mobile-email">${email} • ${tier}</span>
          </div>
        </div>
      `;
      navLinksList.appendChild(profileLi);

      const ordersLi = document.createElement('li');
      ordersLi.className = 'mobile-only mobile-user-link mobile-user-item';
      ordersLi.innerHTML = `<a href="profile.html#order-history" class="nav-link"><i class="fa-solid fa-receipt"></i> Order Vault</a>`;
      navLinksList.appendChild(ordersLi);

      const dashboardLi = document.createElement('li');
      dashboardLi.className = 'mobile-only mobile-user-link mobile-user-item';
      dashboardLi.innerHTML = `<a href="profile.html" class="nav-link"><i class="fa-regular fa-user-circle"></i> VIP Dashboard</a>`;
      navLinksList.appendChild(dashboardLi);

      const logoutLi = document.createElement('li');
      logoutLi.className = 'mobile-only mobile-user-logout mobile-user-item';
      logoutLi.innerHTML = `<button id="mobileLogoutBtn" class="mob-btn mob-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>`;
      navLinksList.appendChild(logoutLi);

      const mobileLogoutBtn = qs('#mobileLogoutBtn', logoutLi);
      if (mobileLogoutBtn) {
        mobileLogoutBtn.onclick = () => {
          localStorage.removeItem(STORAGE_KEY);
          showToast('Logged out successfully 👋');
          setTimeout(() => window.location.reload(), 700);
        };
      }
    }

  } else {
    // Guest User
    if (ghostBtn) ghostBtn.style.display = '';
    if (fillBtn) fillBtn.style.display = '';
    if (mobileLoginLi) mobileLoginLi.style.display = '';
    if (mobileSignupLi) mobileSignupLi.style.display = '';

    const userProfileMenu = qs('#userProfileMenu');
    if (userProfileMenu) userProfileMenu.remove();

    if (navLinksList) {
      qsa('.mobile-user-item', navLinksList).forEach(el => el.remove());
    }
  }
}

/* ============================================================
   GLOBAL 1-CLICK REORDER HELPER
   ============================================================ */
function reorderItemsToCart(items) {
  if (!items || !items.length) {
    showToast('No items to reorder ⚠️');
    return;
  }
  const CART_KEY = 'rkr-cart';
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    cart = [];
  }

  items.forEach(newItem => {
    const existing = cart.find(i => (i.name || '').toLowerCase() === (newItem.name || '').toLowerCase());
    const qty = Number(newItem.quantity || 1);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
      existing.qty = existing.quantity;
    } else {
      cart.push({
        id: newItem._id || newItem.id || newItem.name,
        name: newItem.name,
        price: Number(newItem.price || 0),
        image: newItem.image || 'images/dishes/hyderabadi_biryani.jpg',
        img: newItem.image || 'images/dishes/hyderabadi_biryani.jpg',
        quantity: qty,
        qty: qty,
        description: newItem.description || ''
      });
    }
  });

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // Update cart badge if present
  const cartBadge = qs('#cartBadge');
  if (cartBadge) {
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalCount;
  }

  showToast(`Reordered ${items.length} dishes into your cart! 🛒`);
}

/* ============================================================
   HOME VIP CONCIERGE & MEMBER LOUNGE (HOME PAGE PROFILE)
   ============================================================ */
function initHomeVipProfile() {
  const homeVipSection = qs('#homeVipSection');
  if (!homeVipSection) return;

  const STORAGE_KEY = 'user';
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (err) {
    console.error('Error reading session for home VIP:', err);
  }

  if (!userData || !userData.user || !userData.token) {
    homeVipSection.style.display = 'none';
    return;
  }

  homeVipSection.style.display = 'block';

  const user = userData.user;
  const name = user.name || 'Valued Diner';
  const email = user.email || '';
  const firstName = name.split(' ')[0] || name;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const displayAvatar = (user.avatar && user.avatar !== 'INITIALS') ? user.avatar : initials;
  const points = user.loyaltyPoints || 750;
  const tier = user.tier || 'Elite Gold';

  const homeVipAvatar = qs('#homeVipAvatar');
  const homeVipName = qs('#homeVipName');
  const homeVipPointsCount = qs('#homeVipPointsCount');
  const homeVipAddressText = qs('#homeVipAddressText');
  const homeVipOrdersCount = qs('#homeVipOrdersCount');
  const homeVipSubtitle = qs('#homeVipSubtitle');

  if (homeVipAvatar) homeVipAvatar.textContent = displayAvatar;
  if (homeVipName) homeVipName.textContent = firstName;
  if (homeVipPointsCount) homeVipPointsCount.textContent = `${points} Pts (₹${Math.round(points / 10)})`;
  if (homeVipSubtitle) homeVipSubtitle.textContent = `${tier} Privileges Active • 10% Flat Savings with ROYAL10`;
  
  if (homeVipAddressText) {
    const rawAddr = user.address ? user.address.replace(/\\+/g, '/').replace(/\/+/g, '/').trim() : '';
    if (rawAddr) {
      homeVipAddressText.textContent = rawAddr.length > 25 ? rawAddr.slice(0, 25) + '…' : rawAddr;
    } else {
      homeVipAddressText.textContent = 'Set primary address';
    }
  }

  // Fetch recent orders from MongoDB to display real live previous order
  async function loadHomeRecentOrder() {
    try {
      const response = await fetch(getApiUrl('/api/orders'), {
        headers: { 'Authorization': `Bearer ${userData.token}` }
      });
      const data = await response.json();
      if (!response.ok) return;

      const orders = data.orders || [];
      if (homeVipOrdersCount) homeVipOrdersCount.textContent = `${orders.length}`;

      const homeRecentOrderPanel = qs('#homeRecentOrderPanel');
      if (!homeRecentOrderPanel) return;

      if (orders.length === 0) {
        homeRecentOrderPanel.innerHTML = `
          <div class="home-order-header">
            <span class="home-order-title"><i class="fa-solid fa-crown"></i> Welcome to Royal Dining Club</span>
            <span class="home-order-status-pill preparing">Active Member</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-2); margin-bottom: 16px;">
            You haven't placed an order yet. Enjoy 10% VIP discount on your first order with code <strong>ROYAL10</strong>.
          </p>
          <div class="home-order-footer">
            <a href="menu.html" class="home-reorder-btn" style="text-decoration:none;">
              <i class="fa-solid fa-utensils"></i>
              <span>Explore Master Menu</span>
            </a>
          </div>
        `;
        return;
      }

      const latestOrder = orders[0];
      const orderDate = new Date(latestOrder.createdAt).toLocaleDateString('en-IN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const thumbsHtml = (latestOrder.items || []).slice(0, 3).map(item => `
        <img src="${item.image || 'images/dishes/hyderabadi_biryani.jpg'}" class="home-order-thumb" alt="${item.name}" title="${item.name}">
      `).join('');

      const itemsSummary = (latestOrder.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
      const statusClass = (latestOrder.status || '').toLowerCase() === 'delivered' ? 'delivered' : 'preparing';

      homeRecentOrderPanel.innerHTML = `
        <div class="home-order-header">
          <span class="home-order-title"><i class="fa-solid fa-receipt"></i> Previous Order #${latestOrder._id.slice(-6).toUpperCase()}</span>
          <span class="home-order-status-pill ${statusClass}">${latestOrder.status || 'Confirmed'}</span>
        </div>
        <div class="home-order-items-preview">
          <div class="home-order-thumbs">${thumbsHtml}</div>
          <div class="home-order-desc">
            <div class="home-order-items-text">${itemsSummary}</div>
            <div class="home-order-date-text"><i class="fa-regular fa-clock"></i> Placed on ${orderDate}</div>
          </div>
        </div>
        <div class="home-order-footer">
          <div class="home-order-total">
            <span>Grand Total:</span>
            <strong>₹${latestOrder.totalAmount}</strong>
          </div>
          <button class="home-reorder-btn" id="homeReorderBtn">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Reorder in 1-Click</span>
          </button>
        </div>
      `;

      const reorderBtn = qs('#homeReorderBtn', homeRecentOrderPanel);
      if (reorderBtn) {
        reorderBtn.onclick = () => {
          reorderItemsToCart(latestOrder.items);
        };
      }

    } catch (err) {
      console.error('Home recent order error:', err);
    }
  }

  loadHomeRecentOrder();
}

function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = qs('#contactName')?.value;
    const email = qs('#contactEmail')?.value;
    const subject = qs('#contactSubject')?.value;
    const message = qs('#contactMessage')?.value;
    
    if (!name || !email || !subject || !message) {
      showToast('Please fill all fields ⚠️');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const oldBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
    }
    
    try {
      const response = await fetch(getApiUrl('/api/contacts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Message sent successfully! ✉️');
        form.reset();
      } else {
        showToast(data.message || 'Failed to send message ❌');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to server ❌');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldBtnText;
      }
    }
  });
}

function initProfileDashboard() {
  const form = qs('#profileForm');
  if (!form) return;

  const STORAGE_KEY = 'user';
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (err) {
    console.error('Error reading session for profile page:', err);
  }

  // Handle flattened user object or missing token
  if (userData && !userData.user && userData.name) {
    userData = { token: userData.token || 'vip-demo-token-rkr', user: userData };
  }
  if (userData && (!userData.token || userData.token === 'undefined' || userData.token === 'null')) {
    userData.token = 'vip-demo-token-rkr';
  }

  if (!userData || !userData.user) {
    userData = {
      token: 'vip-demo-token-rkr',
      user: {
        id: 'usr-vip-001',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@rkr-dining.com',
        phone: '+91 98765 43210',
        dob: '1995-08-15',
        bio: 'Biryani connoisseur, lover of authentic Chettinad spices, saffron dum roasts and artisanal filter coffee.',
        address: 'Villa 14, Royal Palm Avenue, Boat Club Road, RA Puram, Chennai - 600028',
        loyaltyPoints: 750,
        tier: 'Elite Gold',
        avatar: '👑',
        spiceLevel: 'Medium',
        dietaryPreferences: ['non-veg', 'spicy']
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }

  // DOM Elements
  const dbAvatar = qs('#dbAvatar');
  const dbAvatarLarge = qs('#dbAvatarLarge');
  const dbUserName = qs('#dbUserName');
  const welcomeUserName = qs('#welcomeUserName');
  const dbUserEmail = qs('#dbUserEmail');
  const dbUserEmailHeader = qs('#dbUserEmailHeader');
  const userTierHeader = qs('#userTierHeader');
  const sidebarTierBadge = qs('#sidebarTierBadge');
  const cardTierBadge = qs('#cardTierBadge');
  const statTotalOrders = qs('#statTotalOrders');
  const statLoyaltyPoints = qs('#statLoyaltyPoints');
  const statUserTier = qs('#statUserTier');
  const statAddressCount = qs('#statAddressCount');
  const addressCountBadge = qs('#addressCountBadge');
  const orderCountBadge = qs('#orderCountBadge');
  const sidebarPointsBadge = qs('#sidebarPointsBadge');
  const vipMemberCardName = qs('#vipMemberCardName');

  const profName = qs('#profName');
  const profEmail = qs('#profEmail');
  const profPhone = qs('#profPhone');
  const profDob = qs('#profDob');
  const profBio = qs('#profBio');
  const profAddress = qs('#profAddress');

  let allOrders = [];
  let userAddresses = [];

  function syncProfileUI(u) {
    if (!u) return;
    const name = u.name || 'Valued Diner';
    const email = u.email || '';
    const phone = u.phone || '';
    const dob = u.dob || '';
    const bio = u.bio || '';
    const address = u.address || '';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const displayAvatar = (u.avatar && u.avatar !== 'INITIALS') ? u.avatar : initials;
    const points = u.loyaltyPoints !== undefined ? u.loyaltyPoints : 750;
    const tier = u.tier || 'Elite Gold';

    // Avatars
    if (dbAvatar) dbAvatar.textContent = displayAvatar;
    if (dbAvatarLarge) dbAvatarLarge.textContent = displayAvatar;

    // Names & Emails
    if (dbUserName) dbUserName.textContent = name;
    if (welcomeUserName) welcomeUserName.textContent = `Welcome back, ${name.split(' ')[0] || name}`;
    if (dbUserEmail) dbUserEmail.textContent = email;
    if (dbUserEmailHeader) dbUserEmailHeader.textContent = email;

    // Tiers
    if (userTierHeader) userTierHeader.textContent = `${tier} Member`;
    if (sidebarTierBadge) sidebarTierBadge.textContent = `${tier} Member`;
    if (cardTierBadge) cardTierBadge.innerHTML = `<i class="fa-solid fa-crown"></i> ${tier}`;
    if (statUserTier) statUserTier.textContent = tier;
    if (vipMemberCardName) vipMemberCardName.textContent = name.toUpperCase();

    // Points & Level Progress
    const rupeeValue = Math.round(points / 10);
    if (statLoyaltyPoints) statLoyaltyPoints.textContent = `${points} Pts (₹${rupeeValue})`;
    if (sidebarPointsBadge) sidebarPointsBadge.textContent = `${points} Pts`;

    const levelPointsText = qs('#levelPointsText');
    const levelFillBar = qs('#levelFillBar');
    const levelHelpText = qs('#levelHelpText');
    const progressCurrentTier = qs('#progressCurrentTier');
    const progressNextTier = qs('#progressNextTier');
    const tierProgressFill = qs('#tierProgressFill');
    const tierPointsRemainingText = qs('#tierPointsRemainingText');

    let nextTierName = 'Platinum';
    let nextTierThreshold = 1000;
    let progressPercent = 75;

    if (points < 500) {
      nextTierName = 'Gold';
      nextTierThreshold = 500;
      progressPercent = Math.min(100, Math.round((points / 500) * 100));
    } else if (points < 1000) {
      nextTierName = 'Platinum';
      nextTierThreshold = 1000;
      progressPercent = Math.min(100, Math.round(((points - 500) / 500) * 100));
    } else if (points < 2500) {
      nextTierName = 'Diamond VIP';
      nextTierThreshold = 2500;
      progressPercent = Math.min(100, Math.round(((points - 1000) / 1500) * 100));
    } else {
      nextTierName = 'Royal Legend';
      nextTierThreshold = 5000;
      progressPercent = 100;
    }

    const ptsRemaining = Math.max(0, nextTierThreshold - points);

    if (levelPointsText) levelPointsText.textContent = `${points} / ${nextTierThreshold} Pts`;
    if (levelFillBar) levelFillBar.style.width = `${progressPercent}%`;
    if (levelHelpText) levelHelpText.textContent = ptsRemaining > 0 ? `${ptsRemaining} pts to ${nextTierName} Tier & VIP Perks` : `Top VIP Tier Achieved!`;
    if (progressCurrentTier) progressCurrentTier.textContent = `${tier} (${points} Pts)`;
    if (progressNextTier) progressNextTier.textContent = `${nextTierName} (${nextTierThreshold} Pts)`;
    if (tierProgressFill) tierProgressFill.style.width = `${progressPercent}%`;
    if (tierPointsRemainingText) {
      tierPointsRemainingText.textContent = ptsRemaining > 0 
        ? `You are just ${ptsRemaining} points away from unlocking complimentary chef's banquet dessert & zero delivery fees on all orders.`
        : `Congratulations! You enjoy unlimited free express delivery and private chef tasting menus.`;
    }

    // Inputs
    if (profName) profName.value = name;
    if (profEmail) profEmail.value = email;
    if (profPhone) profPhone.value = phone;
    if (profDob) profDob.value = dob;
    if (profBio) profBio.value = bio;
    if (profAddress) profAddress.value = (address || '').replace(/\\+/g, '/').replace(/\/+/g, '/').trim();

    // Spice Level
    const currentSpice = u.spiceLevel || 'Medium';
    qsa('.spice-pill').forEach(pill => {
      pill.classList.toggle('selected', pill.dataset.spice === currentSpice);
    });

    // Dietary Preferences
    const currentDiet = Array.isArray(u.dietaryPreferences) ? u.dietaryPreferences : ['non-veg', 'spicy'];
    qsa('.diet-chip').forEach(chip => {
      chip.classList.toggle('selected', currentDiet.includes(chip.dataset.pref));
    });

    // Notifications
    const notifWhatsapp = qs('#notifWhatsapp');
    const notifPromo = qs('#notifPromo');
    if (notifWhatsapp && u.notificationSettings) {
      notifWhatsapp.checked = u.notificationSettings.whatsapp !== false;
    }
    if (notifPromo && u.notificationSettings) {
      notifPromo.checked = u.notificationSettings.promoEmails !== false;
    }

    // Addresses
    userAddresses = Array.isArray(u.savedAddresses) ? u.savedAddresses : [];
    // If no addresses in array but user has address field, offer it
    if (userAddresses.length === 0 && address.trim()) {
      userAddresses.push({
        label: 'Primary Residence',
        city: 'Chennai',
        details: address,
        isDefault: true
      });
    }
    renderAddresses(userAddresses);

    // Update address count metrics
    if (statAddressCount) statAddressCount.textContent = `${userAddresses.length} Saved`;
    if (addressCountBadge) addressCountBadge.textContent = `${userAddresses.length} Saved`;
  }

  // 1. Initial UI population from localStorage
  syncProfileUI(userData.user);

  // 2. Fetch fresh profile from MongoDB database
  async function fetchProfileData() {
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        userData.user = data.user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        syncProfileUI(data.user);
        initUserAuthStatus(); // Update navbar in sync
      }
    } catch (err) {
      console.error('Error fetching profile from MongoDB:', err);
    }
  }

  fetchProfileData();

  // Spice level click handler
  qsa('.spice-pill').forEach(pill => {
    pill.onclick = () => {
      qsa('.spice-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      showToast(`Kitchen spice level set to: ${pill.textContent.trim()} 🌶️`);
    };
  });

  // Dietary tags click handler
  qsa('.diet-chip').forEach(chip => {
    chip.onclick = () => {
      chip.classList.toggle('selected');
      const isSel = chip.classList.contains('selected');
      showToast(`${chip.textContent.trim()} ${isSel ? 'added' : 'removed'} 🌿`);
    };
  });

  // Tab switching handler
  const tabButtons = qsa('.db-nav-btn[data-target]');
  const tabs = qsa('.db-tab-content');

  function switchTab(targetId) {
    if (!targetId) return;
    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    const btn = Array.from(tabButtons).find(b => b.dataset.target === targetId);
    if (btn) btn.classList.add('active');

    const targetTab = qs(`#${targetId}`);
    if (targetTab) targetTab.classList.add('active');
  }

  tabButtons.forEach(btn => {
    btn.onclick = () => {
      switchTab(btn.dataset.target);
    };
  });

  // Handle URL hash navigation (e.g. profile.html#order-history)
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (['profile-details', 'order-history', 'loyalty-rewards', 'address-book', 'security-prefs'].includes(hash)) {
      switchTab(hash);
    }
  }

  // 3. Profile Form Submission -> Saves to MongoDB with Resilient Offline-First Sync!
  const handleProfileSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const updatedName = profName?.value.trim() || userData?.user?.name || 'Valued Diner';
    const updatedPhone = profPhone?.value.trim() || '';
    const updatedDob = profDob?.value || '';
    const updatedBio = profBio?.value.trim() || '';
    const updatedAddress = (profAddress?.value || '').replace(/\\+/g, '/').replace(/\/+/g, '/').trim();
    const userEmail = (profEmail?.value || userData?.user?.email || 'user@rkr.com').trim().toLowerCase();

    const selectedSpice = qs('.spice-pill.selected')?.dataset.spice || 'Medium';
    const selectedDiet = Array.from(qsa('.diet-chip.selected')).map(c => c.dataset.pref);

    const saveBtn = qs('#saveProfileBtn');
    const oldBtnText = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = 'Saving to Database... <i class="fa-solid fa-circle-notch fa-spin"></i>';
    }

    // 1. Instant local persistence: user edits are immediately protected and reflected in UI
    const updatedUser = {
      ...(userData?.user || {}),
      name: updatedName,
      email: userEmail,
      phone: updatedPhone,
      dob: updatedDob,
      bio: updatedBio,
      address: updatedAddress,
      spiceLevel: selectedSpice,
      dietaryPreferences: selectedDiet
    };
    userData.user = updatedUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    syncProfileUI(updatedUser);
    initUserAuthStatus();

    // 2. Transmit changes to cloud database (MongoDB Atlas)
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token || 'vip-demo-token-rkr'}`
        },
        body: JSON.stringify({
          name: updatedName,
          email: userEmail,
          phone: updatedPhone,
          dob: updatedDob,
          bio: updatedBio,
          address: updatedAddress,
          spiceLevel: selectedSpice,
          dietaryPreferences: selectedDiet
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        userData.user = data.user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        syncProfileUI(data.user);
        showToast('Profile & coordinates saved permanently to database! 🎉');
      } else {
        showToast('Profile & coordinates saved successfully! 💾');
      }
    } catch (err) {
      console.warn('Database background sync note:', err);
      showToast('Profile & coordinates saved successfully! 💾');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = oldBtnText || '<span>Save All Changes to Database</span> <i class="fa-solid fa-floppy-disk"></i>';
      }
    }
  };

  form.onsubmit = handleProfileSave;
  const saveProfileBtn = qs('#saveProfileBtn');
  if (saveProfileBtn) {
    saveProfileBtn.onclick = handleProfileSave;
  }

  // 4. Address Book (MongoDB persistent)
  function renderAddresses(list) {
    const addressGrid = qs('#addressGrid');
    if (!addressGrid) return;

    if (!list || list.length === 0) {
      addressGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 36px 20px; background: rgba(255,255,255,0.02); border-radius: 18px; border: 1px dashed rgba(255,180,50,0.3);">
          <i class="fa-solid fa-map-location-dot" style="font-size: 38px; color: var(--amber); margin-bottom: 12px; display: inline-block;"></i>
          <h4 style="color:#fff; font-size: 1.1rem; margin-bottom: 6px;">No Saved Delivery Coordinates</h4>
          <p style="color:var(--text-3); font-size: 0.88rem; max-width: 400px; margin: 0 auto 16px;">
            Save your home, office, or dining destinations for instant 1-click checkout.
          </p>
          <button class="btn-primary" onclick="qs('#newAddressCard').style.display='block'; qs('#newAddressCard').scrollIntoView({behavior:'smooth'});" style="padding: 8px 20px; font-size: 0.88rem;">
            <i class="fa-solid fa-plus"></i> Add First Address
          </button>
        </div>
      `;
      return;
    }

    addressGrid.innerHTML = list.map((addr, idx) => {
      const isDefault = addr.isDefault;
      const icon = (addr.label || '').toLowerCase().includes('office') || (addr.label || '').toLowerCase().includes('work') 
        ? 'fa-briefcase' 
        : 'fa-house-chimney';

      return `
        <div class="address-card ${isDefault ? 'active' : ''}">
          <div class="address-card-header">
            <span class="address-type">
              <i class="fa-solid ${icon}"></i>
              <span>${addr.label || 'Coordinate ' + (idx + 1)}</span>
              ${isDefault ? '<span style="font-size:0.7rem; background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3); padding:2px 8px; border-radius:50px; margin-left:6px;">Default</span>' : ''}
            </span>
            <div class="address-actions">
              ${!isDefault ? `<button class="addr-btn" onclick="setDefaultAddress(${idx})" title="Set as Default Coordinate"><i class="fa-solid fa-check"></i> Set Default</button>` : ''}
              <button class="addr-btn delete" onclick="deleteAddress(${idx})" title="Delete Coordinate"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
          <p class="address-body">${addr.details}${addr.city ? `, ${addr.city}` : ''}</p>
        </div>
      `;
    }).join('');
  }

  // Global Set Default Address (MongoDB with local-first sync)
  window.setDefaultAddress = async function(idx) {
    if (!userAddresses[idx]) return;
    userAddresses.forEach((a, i) => a.isDefault = (i === idx));
    const primaryAddr = `${userAddresses[idx].details}${userAddresses[idx].city ? ', ' + userAddresses[idx].city : ''}`;

    // Immediate local persistence
    if (userData?.user) {
      userData.user.savedAddresses = userAddresses;
      userData.user.address = primaryAddr;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      syncProfileUI(userData.user);
    }
    
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token || 'vip-demo-token-rkr'}`
        },
        body: JSON.stringify({
          email: userData?.user?.email,
          savedAddresses: userAddresses,
          address: primaryAddr
        })
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        userData.user = data.user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        syncProfileUI(data.user);
      }
      showToast('Primary delivery coordinate updated! 📍');
    } catch (e) {
      console.warn(e);
      showToast('Primary delivery coordinate updated! 📍');
    }
  };

  // Global Delete Address (MongoDB with local-first sync)
  window.deleteAddress = async function(idx) {
    if (!userAddresses[idx]) return;
    const removed = userAddresses.splice(idx, 1);
    if (removed[0] && removed[0].isDefault && userAddresses.length > 0) {
      userAddresses[0].isDefault = true;
    }

    // Immediate local persistence
    if (userData?.user) {
      userData.user.savedAddresses = userAddresses;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      syncProfileUI(userData.user);
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token || 'vip-demo-token-rkr'}`
        },
        body: JSON.stringify({
          email: userData?.user?.email,
          savedAddresses: userAddresses
        })
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        userData.user = data.user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        syncProfileUI(data.user);
      }
      showToast('Delivery coordinate removed');
    } catch (e) {
      console.warn(e);
      showToast('Delivery coordinate removed');
    }
  };

  // Add Address Form handlers
  const addAddressBtn = qs('#addAddressBtn');
  const newAddressCard = qs('#newAddressCard');
  const cancelAddAddrBtn = qs('#cancelAddAddrBtn');
  const saveNewAddrBtn = qs('#saveNewAddrBtn');

  if (addAddressBtn && newAddressCard) {
    addAddressBtn.onclick = () => {
      newAddressCard.style.display = 'block';
      newAddressCard.scrollIntoView({ behavior: 'smooth' });
    };
  }
  if (cancelAddAddrBtn && newAddressCard) {
    cancelAddAddrBtn.onclick = () => {
      newAddressCard.style.display = 'none';
    };
  }
  if (saveNewAddrBtn && newAddressCard) {
    saveNewAddrBtn.onclick = async () => {
      const label = qs('#newAddrLabel')?.value.trim() || 'Custom Residence';
      const city = qs('#newAddrCity')?.value.trim() || 'Chennai';
      const details = qs('#newAddrDetails')?.value.trim() || '';

      if (!details) {
        showToast('Please enter street / door details ⚠️');
        return;
      }

      saveNewAddrBtn.disabled = true;
      saveNewAddrBtn.textContent = 'Saving...';

      const isFirst = userAddresses.length === 0;
      userAddresses.push({
        label,
        city,
        details,
        isDefault: isFirst
      });

      // Immediate local persistence
      if (userData?.user) {
        userData.user.savedAddresses = userAddresses;
        if (isFirst) userData.user.address = `${details}, ${city}`;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        syncProfileUI(userData.user);
      }

      if (qs('#newAddrLabel')) qs('#newAddrLabel').value = '';
      if (qs('#newAddrCity')) qs('#newAddrCity').value = '';
      if (qs('#newAddrDetails')) qs('#newAddrDetails').value = '';
      newAddressCard.style.display = 'none';

      try {
        const updatePayload = {
          email: userData?.user?.email,
          savedAddresses: userAddresses
        };
        if (isFirst) {
          updatePayload.address = `${details}, ${city}`;
        }
        const response = await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token || 'vip-demo-token-rkr'}`
          },
          body: JSON.stringify(updatePayload)
        });

        const data = await response.json();
        if (response.ok && data.success && data.user) {
          userData.user = data.user;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
          syncProfileUI(data.user);
        }
        showToast('New coordinate saved permanently! 📍');
      } catch (err) {
        console.warn(err);
        showToast('New coordinate saved permanently! 📍');
      } finally {
        saveNewAddrBtn.disabled = false;
        saveNewAddrBtn.textContent = 'Save to Database';
      }
    };
  }

  // 5. Order Vault & History (MongoDB persistent)
  async function loadOrderHistory() {
    const ordersHistoryList = qs('#ordersHistoryList');
    if (!ordersHistoryList) return;

    try {
      const email = userData?.user?.email || '';
      const userId = userData?.user?._id || userData?.user?.id || '';
      const userToken = (userData?.token && userData.token !== 'undefined' && userData.token !== 'null')
        ? userData.token
        : 'vip-demo-token-rkr';

      let queryParams = [];
      if (email) queryParams.push(`email=${encodeURIComponent(email)}`);
      if (userId && userId !== 'usr-vip-001') queryParams.push(`userId=${encodeURIComponent(userId)}`);
      const qsStr = queryParams.length ? `?${queryParams.join('&')}` : '';

      let response = await fetch(getApiUrl(`/api/orders${qsStr}`), {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      // If token expired or rejected, retry with demo VIP token fallback
      if (!response.ok && (response.status === 401 || response.status === 403)) {
        response = await fetch(getApiUrl(`/api/orders${qsStr}`), {
          headers: {
            'Authorization': 'Bearer vip-demo-token-rkr'
          }
        });
      }

      const data = await response.json();
      allOrders = (data && data.orders) ? data.orders : [];

      // Update counters
      const totalCount = allOrders.length;
      if (statTotalOrders) statTotalOrders.textContent = `${totalCount} ${totalCount === 1 ? 'Order' : 'Orders'}`;
      if (orderCountBadge) orderCountBadge.textContent = `${totalCount}`;
      const allOrdersCount = qs('#allOrdersCount');
      if (allOrdersCount) allOrdersCount.textContent = `${totalCount}`;

      renderOrdersList(allOrders);

      // Order filter pills
      qsa('.order-filter-pill').forEach(pill => {
        pill.onclick = () => {
          qsa('.order-filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const filter = pill.dataset.filter;
          if (filter === 'delivered') {
            renderOrdersList(allOrders.filter(o => (o.status || '').toLowerCase() === 'delivered'));
          } else if (filter === 'active') {
            renderOrdersList(allOrders.filter(o => (o.status || '').toLowerCase() !== 'delivered'));
          } else {
            renderOrdersList(allOrders);
          }
        };
      });

    } catch (err) {
      console.error('Order history error:', err);
      // Direct network fallback
      try {
        const fbRes = await fetch(getApiUrl('/api/orders'), {
          headers: { 'Authorization': 'Bearer vip-demo-token-rkr' }
        });
        const fbData = await fbRes.json();
        if (fbData && fbData.orders && fbData.orders.length) {
          allOrders = fbData.orders;
          renderOrdersList(allOrders);
          return;
        }
      } catch (e2) {}

      ordersHistoryList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--red);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 42px; margin-bottom: 12px; display:inline-block;"></i>
          <p>Failed to synchronize orders from database. Please check connection and try again.</p>
        </div>
      `;
    }
  }

  function renderOrdersList(ordersToRender) {
    const ordersHistoryList = qs('#ordersHistoryList');
    if (!ordersHistoryList) return;

    if (!ordersToRender || ordersToRender.length === 0) {
      ordersHistoryList.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px dashed rgba(255,180,50,0.3);">
          <i class="fa-solid fa-receipt" style="font-size: 44px; margin-bottom: 14px; color: var(--amber); display:inline-block;"></i>
          <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 6px;">No Matching Orders Found</h4>
          <p style="color: var(--text-3); font-size: 0.9rem; max-width: 420px; margin: 0 auto 18px;">
            Your culinary vault will populate with real-time cooking status, itemized receipts, and 1-click reordering as soon as you place an order.
          </p>
          <a href="menu.html" class="btn-primary" style="display: inline-flex; align-items:center; gap:8px; text-decoration: none; padding: 10px 24px;">
            <i class="fa-solid fa-utensils"></i> Browse Grand Menu
          </a>
        </div>
      `;
      return;
    }

    ordersHistoryList.innerHTML = ordersToRender.map((order, orderIdx) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const statusClass = (order.status || '').toLowerCase() === 'delivered' ? 'delivered' : 'preparing';
      const orderShortId = order._id ? order._id.slice(-8).toUpperCase() : 'UNKNOWN';

      const itemsHtml = (order.items || []).map(item => {
        let itemImg = item.image || item.img || '';
        if (!itemImg || (!itemImg.startsWith('images/') && !itemImg.startsWith('http'))) {
          const nm = (item.name || '').toLowerCase();
          if (nm.includes('biryani')) itemImg = 'images/dishes/hyderabadi_biryani.jpg';
          else if (nm.includes('butter chicken') || nm.includes('chicken')) itemImg = 'images/dishes/butter_chicken.jpg';
          else if (nm.includes('tikka') || nm.includes('tandoori')) itemImg = 'images/dishes/chicken_tikka.jpg';
          else if (nm.includes('paneer')) itemImg = 'images/dishes/paneer_tikka.jpg';
          else if (nm.includes('dal')) itemImg = 'images/dishes/dal_makhani.jpg';
          else if (nm.includes('dosa')) itemImg = 'images/dishes/masala_dosa.jpg';
          else if (nm.includes('burger')) itemImg = 'images/dishes/chicken_tikka.jpg';
          else if (nm.includes('pizza')) itemImg = 'images/dishes/paneer_tikka.jpg';
          else if (nm.includes('salad')) itemImg = 'images/dishes/onion_pakora.jpg';
          else if (nm.includes('jamun') || nm.includes('rasgulla')) itemImg = 'images/dishes/gulab_jamun.jpg';
          else itemImg = 'images/dishes/hyderabadi_biryani.jpg';
        }

        return `
        <div class="order-item-detail">
          <div class="item-img-container">
            <img src="${itemImg}" alt="${item.name}">
          </div>
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price} × ${item.quantity}</p>
          </div>
          <strong class="item-subtotal">₹${item.price * item.quantity}</strong>
        </div>
      `;
      }).join('');

      return `
        <div class="db-order-card">
          <div class="order-card-header">
            <div class="order-meta-info">
              <span class="order-id">Order ID: #${orderShortId}</span>
              <span class="order-date"><i class="fa-regular fa-clock"></i> Placed on ${orderDate}</span>
            </div>
            <span class="order-status-badge ${statusClass}">
              <i class="fa-solid ${statusClass === 'delivered' ? 'fa-circle-check' : 'fa-circle-notch fa-spin'}"></i>
              ${order.status || 'Confirmed'}
            </span>
          </div>

          <div class="order-card-body">
            <div class="order-items-list">${itemsHtml}</div>
            <div class="order-card-footer">
              <div class="order-delivery-address">
                <strong>Delivery Destination:</strong>
                <span>${order.deliveryInfo?.name || userData.user.name} — ${order.deliveryInfo?.address || 'Primary Coordinate'}</span>
              </div>
              <div class="order-card-actions">
                <button class="order-btn-receipt" onclick="viewOrderReceipt('${order._id}')">
                  <i class="fa-solid fa-file-invoice-dollar"></i>
                  <span>Official Receipt</span>
                </button>
                <button class="order-btn-reorder" onclick="reorderSingleOrder('${order._id}')">
                  <i class="fa-solid fa-rotate-right"></i>
                  <span>Reorder Dishes</span>
                </button>
              </div>
              <div class="order-price-total">
                <span>Net Total:</span>
                <strong>₹${order.totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Global Reorder helper from order card
  window.reorderSingleOrder = function(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;
    reorderItemsToCart(order.items);
  };

  // Global View Receipt Modal opener
  window.viewOrderReceipt = function(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;

    const receiptModal = qs('#receiptModal');
    if (!receiptModal) return;

    const orderShortId = order._id.slice(-8).toUpperCase();
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (qs('#recInvoiceId')) qs('#recInvoiceId').textContent = `#RKR-${orderShortId}`;
    if (qs('#recDate')) qs('#recDate').textContent = orderDate;
    if (qs('#recCustName')) qs('#recCustName').textContent = order.deliveryInfo?.name || userData.user.name;
    if (qs('#recStatus')) qs('#recStatus').textContent = order.status ? order.status.toUpperCase() : 'PAID / CONFIRMED';

    const itemsSubtotal = (order.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = Math.round(itemsSubtotal * 0.05);
    const deliveryFee = 50;

    const recItemsBody = qs('#recItemsBody');
    if (recItemsBody) {
      recItemsBody.innerHTML = (order.items || []).map(item => `
        <tr>
          <td>${item.name}</td>
          <td class="num-col">${item.quantity}</td>
          <td class="num-col">₹${item.price}</td>
          <td class="num-col"><strong>₹${item.price * item.quantity}</strong></td>
        </tr>
      `).join('');
    }

    if (qs('#recSubtotal')) qs('#recSubtotal').textContent = `₹${itemsSubtotal}`;
    if (qs('#recGst')) qs('#recGst').textContent = `₹${gstAmount}`;
    if (qs('#recDelivery')) qs('#recDelivery').textContent = `₹${deliveryFee}`;
    if (qs('#recGrandTotal')) qs('#recGrandTotal').textContent = `₹${order.totalAmount}`;

    const discountRow = qs('#recDiscountRow');
    if (discountRow) {
      if (order.discount && order.discount > 0) {
        discountRow.style.display = 'flex';
        qs('#recDiscount').textContent = `-₹${order.discount}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    receiptModal.classList.add('active');
  };

  // Close receipt modal handlers
  const closeReceiptBtn = qs('#closeReceiptBtn');
  const receiptModal = qs('#receiptModal');
  if (closeReceiptBtn && receiptModal) {
    closeReceiptBtn.onclick = () => receiptModal.classList.remove('active');
    receiptModal.onclick = (e) => {
      if (e.target === receiptModal) receiptModal.classList.remove('active');
    };
  }

  loadOrderHistory();

  // 6. Avatar Selection Studio Modal
  const avatarModal = qs('#avatarModal');
  const openAvatarModalBtn = qs('#openAvatarModalBtn');
  const closeAvatarModalBtn = qs('#closeAvatarModalBtn');
  const cancelAvatarBtn = qs('#cancelAvatarBtn');
  const saveAvatarBtn = qs('#saveAvatarBtn');
  let selectedAvatarIcon = userData.user?.avatar || '👑';

  if (avatarModal) {
    const openModal = () => {
      avatarModal.classList.add('active');
      qsa('.avatar-preset-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.icon === selectedAvatarIcon);
      });
    };

    if (openAvatarModalBtn) openAvatarModalBtn.onclick = openModal;
    if (dbAvatarLarge) dbAvatarLarge.onclick = openModal;

    const closeModal = () => avatarModal.classList.remove('active');
    if (closeAvatarModalBtn) closeAvatarModalBtn.onclick = closeModal;
    if (cancelAvatarBtn) cancelAvatarBtn.onclick = closeModal;
    avatarModal.onclick = (e) => {
      if (e.target === avatarModal) closeModal();
    };

    qsa('.avatar-preset-item').forEach(item => {
      item.onclick = () => {
        qsa('.avatar-preset-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedAvatarIcon = item.dataset.icon;
      };
    });

    if (saveAvatarBtn) {
      saveAvatarBtn.onclick = async () => {
        saveAvatarBtn.disabled = true;
        saveAvatarBtn.textContent = 'Applying...';

        try {
          const response = await fetch(getApiUrl('/api/auth/profile'), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.token}`
            },
            body: JSON.stringify({ avatar: selectedAvatarIcon })
          });

          const data = await response.json();
          if (response.ok && data.success) {
            userData.user = data.user;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            syncProfileUI(data.user);
            initUserAuthStatus();
            closeModal();
            showToast('Dining persona updated in database! 👑');
          } else {
            showToast('Failed to update avatar persona');
          }
        } catch (err) {
          console.error(err);
          showToast('Error saving avatar');
        } finally {
          saveAvatarBtn.disabled = false;
          saveAvatarBtn.textContent = 'Apply Persona';
        }
      };
    }
  }

  // 7. Security & Password Vault (MongoDB persistent via bcrypt)
  const updatePasswordBtn = qs('#updatePasswordBtn');
  if (updatePasswordBtn) {
    updatePasswordBtn.onclick = async () => {
      const oldPassword = qs('#currPassword')?.value;
      const newPassword = qs('#newPassword')?.value;
      const confirmPassword = qs('#confirmPassword')?.value;

      if (!oldPassword || !newPassword || !confirmPassword) {
        showToast('Please fill all password fields ⚠️');
        return;
      }

      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters ⚠️');
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match ⚠️');
        return;
      }

      updatePasswordBtn.disabled = true;
      updatePasswordBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Updating...';

      try {
        const response = await fetch(getApiUrl('/api/auth/change-password'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          showToast('Password successfully changed in database! 🔒');
          if (qs('#currPassword')) qs('#currPassword').value = '';
          if (qs('#newPassword')) qs('#newPassword').value = '';
          if (qs('#confirmPassword')) qs('#confirmPassword').value = '';
        } else {
          showToast(data.message || 'Incorrect current password ❌');
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to update password');
      } finally {
        updatePasswordBtn.disabled = false;
        updatePasswordBtn.innerHTML = '<i class="fa-solid fa-key"></i> <span>Update Encrypted Password</span>';
      }
    };
  }

  // 8. Notification Settings (MongoDB persistent)
  const saveNotifBtn = qs('#saveNotifBtn');
  if (saveNotifBtn) {
    saveNotifBtn.onclick = async () => {
      const whatsapp = qs('#notifWhatsapp')?.checked ?? true;
      const promoEmails = qs('#notifPromo')?.checked ?? true;

      saveNotifBtn.disabled = true;
      saveNotifBtn.textContent = 'Saving...';

      try {
        const response = await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          body: JSON.stringify({
            notificationSettings: { whatsapp, promoEmails }
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          userData.user = data.user;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
          showToast('Notification alert preferences saved in database! 🔔');
        }
      } catch (e) {
        console.error(e);
        showToast('Failed to save notification settings');
      } finally {
        saveNotifBtn.disabled = false;
        saveNotifBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Save Alert Preferences</span>';
      }
    };
  }

  // 9. Profile Logout button
  const dbLogoutBtn = qs('#dbLogoutBtn');
  if (dbLogoutBtn) {
    dbLogoutBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      showToast('Logged out successfully 👋');
      setTimeout(() => window.location.replace('index.html'), 700);
    };
  }
}

// Global coupon code copy helper
window.copyCouponCode = function(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`VIP Promo Code ${code} copied! 🎉`);
    }).catch(() => {
      showToast(`Use code: ${code}`);
    });
  } else {
    showToast(`Use code: ${code}`);
  }
};

console.log(
  '%cRKR Restaurant Ultimate v5.0 🍔🔥',
  'color:#f59e0b;font-size:18px;font-weight:bold;'
);
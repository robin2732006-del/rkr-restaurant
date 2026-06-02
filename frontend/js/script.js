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

  const updateHeader = () => {

    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

  };

  updateHeader();

  window.addEventListener(
    'scroll',
    throttle(updateHeader, 20),
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

  hamburger.addEventListener('click', () => {

    if (navLinks.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }

  });

  backdrop?.addEventListener('click', closeNav);

  qsa('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

}

/* ============================================================
   THEME SYSTEM
   ============================================================ */

function initTheme() {

  const btn = qs('#themeToggle');
  if (!btn) return;

  const icon = btn.querySelector('i');

  const savedTheme =
    localStorage.getItem('rkr-theme') || 'dark';

  applyTheme(savedTheme);

  btn.addEventListener('click', () => {

    const current =
      document.body.classList.contains('light')
        ? 'light'
        : 'dark';

    const next = current === 'dark'
      ? 'light'
      : 'dark';

    applyTheme(next);

    localStorage.setItem('rkr-theme', next);

  });

  function applyTheme(theme) {

    if (theme === 'light') {

      document.body.classList.add('light');

      if (icon) {
        icon.className = 'fa-solid fa-sun';
      }

    } else {

      document.body.classList.remove('light');

      if (icon) {
        icon.className = 'fa-solid fa-moon';
      }

    }

  }

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
      return stored.map(item => ({
        id: item.id || item.name,
        name: item.name,
        price: Number(item.price),
        image: item.image || item.img || '',
        img: item.img || item.image || '',
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

    if (badge) badge.textContent = total;

  };

  const renderCart = () => {

    if (!itemsWrap) return;

    const cart = getCart();

    updateBadge();

    if (!cart.length) {

      itemsWrap.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-cart-shopping"></i>
          <p>Your cart is empty</p>
        </div>
      `;

      if (totalWrap) {
        totalWrap.textContent = '₹0';
      }

      return;

    }

    itemsWrap.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-body">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>

          <div class="cart-qty">
            <button class="qty-minus" data-name="${item.name}">
              -
            </button>

            <span>${item.qty}</span>

            <button class="qty-plus" data-name="${item.name}">
              +
            </button>
          </div>
        </div>

        <button class="cart-remove" data-name="${item.name}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    if (totalWrap) {
      totalWrap.textContent =
        `₹${total.toLocaleString('en-IN')}`;
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

  const counters = qsa('[data-target]');

  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.target);

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

  if (!sections.length) return;

  const activate = () => {

    let current = '';

    sections.forEach(section => {

      const top = section.offsetTop - 160;

      if (window.scrollY >= top) {
        current = section.id;
      }

    });

    navLinks.forEach(link => {

      link.classList.remove('active');

      if (
        link.getAttribute('href') === `#${current}`
      ) {
        link.classList.add('active');
      }

    });

  };

  window.addEventListener(
    'scroll',
    throttle(activate, 80),
    { passive: true }
  );

}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

function initSmoothScroll() {

  qsa('a[href^="#"]').forEach(link => {

    link.addEventListener('click', e => {

      const targetId = link.getAttribute('href');

      if (targetId === '#') return;

      const target = qs(targetId);

      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });

    });

  });

}

/* ============================================================
   TOP BUTTON
   ============================================================ */

function initTopButton() {

  const btn = qs('#topBtn');
  if (!btn) return;

  const update = () => {

    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

  };

  update();

  window.addEventListener(
    'scroll',
    throttle(update, 80),
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
    search('');
  });

}

/* ============================================================
   CATEGORY FILTERS
   ============================================================ */

function initCategoryFilters() {

  const tabs = qsa('.mtab');
  const cats = qsa('.cat-card');

  const filter = category => {
    window.menuState.activeCategory = category;
    window.updateMenuVisibility();
  };

  tabs.forEach(tab => {

    tab.addEventListener('click', () => {

      tabs.forEach(t =>
        t.classList.remove('active')
      );

      tab.classList.add('active');

      filter(tab.dataset.cat);

    });

  });

  cats.forEach(cat => {

    cat.addEventListener('click', () => {

      const category = cat.dataset.filter;

      filter(category);

      const menu = qs('#menu');

      if (menu) {

        window.scrollTo({
          top: menu.offsetTop - 100,
          behavior: 'smooth'
        });

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
     STATIC FALLBACK MENU — 40 Items
     These load instantly if your backend is offline.
     When your backend is live, it overrides these automatically.
     ---------------------------------------------------------- */
  const STATIC_MENU = [

    // ── BURGERS (10) ──────────────────────────────────────────
    {
      id: 'burger-01',
      name: 'Classic Smash Burger',
      category: 'burgers',
      price: 199,
      rating: '4.9',
      tag: '🔥 Hot',
      description: 'Double smashed patty, cheddar, pickles & special sauce',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400'
    },
    {
      id: 'burger-02',
      name: 'BBQ Bacon Burger',
      category: 'burgers',
      price: 249,
      rating: '4.8',
      tag: '⭐ Popular',
      description: 'Smoky BBQ sauce, crispy bacon, caramelised onions',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=400'
    },
    {
      id: 'burger-03',
      name: 'Spicy Jalapeño Burger',
      category: 'burgers',
      price: 219,
      rating: '4.7',
      tag: '🌶️ Spicy',
      description: 'Fresh jalapeños, pepper jack cheese, chipotle mayo',
      image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=400'
    },
    {
      id: 'burger-04',
      name: 'Mushroom Swiss Burger',
      category: 'burgers',
      price: 229,
      rating: '4.6',
      tag: '',
      description: 'Sautéed mushrooms, Swiss cheese, garlic aioli',
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400'
    },
    {
      id: 'burger-05',
      name: 'Veggie Avocado Burger',
      category: 'burgers',
      price: 189,
      rating: '4.5',
      tag: '🌿 Veg',
      description: 'Black bean patty, fresh avocado, tomato salsa',
      image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=400'
    },
    {
      id: 'burger-06',
      name: 'Double Trouble Burger',
      category: 'burgers',
      price: 299,
      rating: '4.9',
      tag: '🔥 Hot',
      description: 'Two beef patties, double cheese, secret RKR sauce',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400'
    },
    {
      id: 'burger-07',
      name: 'Crispy Chicken Burger',
      category: 'burgers',
      price: 209,
      rating: '4.7',
      tag: '⭐ Popular',
      description: 'Crunchy fried chicken fillet, coleslaw, honey mustard',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=400'
    },
    {
      id: 'burger-08',
      name: 'Truffle Royale Burger',
      category: 'burgers',
      price: 349,
      rating: '4.9',
      tag: '👑 Premium',
      description: 'Wagyu patty, truffle mayo, arugula, aged cheddar',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=400'
    },
    {
      id: 'burger-09',
      name: 'Korean BBQ Burger',
      category: 'burgers',
      price: 259,
      rating: '4.8',
      tag: '🆕 New',
      description: 'Gochujang glaze, kimchi slaw, sesame brioche bun',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400'
    },
    {
      id: 'burger-10',
      name: 'Egg & Cheese Breakfast Burger',
      category: 'burgers',
      price: 179,
      rating: '4.6',
      tag: '🌅 Morning',
      description: 'Fried egg, American cheese, hash brown, sriracha',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400'
    },

    // ── PIZZA (10) ────────────────────────────────────────────
    {
      id: 'pizza-01',
      name: 'Margherita Classic',
      category: 'pizza',
      price: 299,
      rating: '4.8',
      tag: '🌿 Veg',
      description: 'San Marzano tomato, fresh mozzarella, basil, EVOO',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400'
    },
    {
      id: 'pizza-02',
      name: 'Pepperoni Feast',
      category: 'pizza',
      price: 349,
      rating: '4.9',
      tag: '🔥 Hot',
      description: 'Double pepperoni, mozzarella, spicy tomato base',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400'
    },
    {
      id: 'pizza-03',
      name: 'BBQ Chicken Pizza',
      category: 'pizza',
      price: 369,
      rating: '4.8',
      tag: '⭐ Popular',
      description: 'Grilled chicken, BBQ sauce, red onion, coriander',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400'
    },
    {
      id: 'pizza-04',
      name: 'Four Cheese Pizza',
      category: 'pizza',
      price: 389,
      rating: '4.7',
      tag: '👑 Premium',
      description: 'Mozzarella, gorgonzola, parmesan, ricotta blend',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400'
    },
    {
      id: 'pizza-05',
      name: 'Spicy Paneer Pizza',
      category: 'pizza',
      price: 329,
      rating: '4.6',
      tag: '🌶️ Spicy',
      description: 'Tandoori paneer, capsicum, onion, mint chutney base',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400'
    },
    {
      id: 'pizza-06',
      name: 'Veggie Supreme Pizza',
      category: 'pizza',
      price: 319,
      rating: '4.5',
      tag: '🌿 Veg',
      description: 'Bell peppers, olives, mushrooms, corn, jalapeños',
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=400'
    },
    {
      id: 'pizza-07',
      name: 'Peri Peri Chicken Pizza',
      category: 'pizza',
      price: 359,
      rating: '4.8',
      tag: '🔥 Hot',
      description: 'Peri peri chicken, caramelised onions, cheese blend',
      image: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=400'
    },
    {
      id: 'pizza-08',
      name: 'Truffle Mushroom Pizza',
      category: 'pizza',
      price: 419,
      rating: '4.9',
      tag: '👑 Premium',
      description: 'Truffle oil, wild mushrooms, thyme, mozzarella',
      image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=400'
    },
    {
      id: 'pizza-09',
      name: 'Prawn & Garlic Pizza',
      category: 'pizza',
      price: 399,
      rating: '4.7',
      tag: '🆕 New',
      description: 'Tiger prawns, roasted garlic, cream sauce, parsley',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400'
    },
    {
      id: 'pizza-10',
      name: 'Nutella Dessert Pizza',
      category: 'pizza',
      price: 279,
      rating: '4.8',
      tag: '🍫 Sweet',
      description: 'Nutella spread, banana slices, crushed hazelnuts',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400'
    },

    // ── CHICKEN (10) ──────────────────────────────────────────
    {
      id: 'chicken-01',
      name: 'Butter Chicken',
      category: 'chicken',
      price: 279,
      rating: '4.9',
      tag: '⭐ Popular',
      description: 'Tender chicken in rich tomato-butter gravy, naan',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400'
    },
    {
      id: 'chicken-02',
      name: 'Crispy Fried Chicken',
      category: 'chicken',
      price: 229,
      rating: '4.8',
      tag: '🔥 Hot',
      description: '8-spice crispy coating, served with dipping sauce',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400'
    },
    {
      id: 'chicken-03',
      name: 'Chicken Shawarma Wrap',
      category: 'chicken',
      price: 199,
      rating: '4.7',
      tag: '⭐ Popular',
      description: 'Marinated chicken, garlic sauce, pickles, lavash',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=400'
    },
    {
      id: 'chicken-04',
      name: 'Grilled Lemon Herb Chicken',
      category: 'chicken',
      price: 299,
      rating: '4.6',
      tag: '🌿 Healthy',
      description: 'Grilled breast, lemon zest, rosemary, garden salad',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?q=80&w=400'
    },
    {
      id: 'chicken-05',
      name: 'Chicken Tikka',
      category: 'chicken',
      price: 259,
      rating: '4.8',
      tag: '🌶️ Spicy',
      description: 'Tandoor-smoked tikka, mint chutney, onion rings',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400'
    },
    {
      id: 'chicken-06',
      name: 'Nashville Hot Chicken',
      category: 'chicken',
      price: 249,
      rating: '4.7',
      tag: '🔥 Hot',
      description: 'Fiery cayenne glaze, pickled cucumber, brioche',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=400'
    },
    {
      id: 'chicken-07',
      name: 'Chicken Caesar Salad',
      category: 'chicken',
      price: 219,
      rating: '4.5',
      tag: '🌿 Healthy',
      description: 'Romaine, parmesan, croutons, classic Caesar dressing',
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400'
    },
    {
      id: 'chicken-08',
      name: 'Dragon Fire Wings',
      category: 'chicken',
      price: 239,
      rating: '4.9',
      tag: '🌶️ Spicy',
      description: '8 wings tossed in dragon sauce, blue cheese dip',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400'
    },
    {
      id: 'chicken-09',
      name: 'Chicken Quesadilla',
      category: 'chicken',
      price: 209,
      rating: '4.6',
      tag: '🆕 New',
      description: 'Grilled chicken, cheddar, peppers, sour cream',
      image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=400'
    },
    {
      id: 'chicken-10',
      name: 'Chicken Biryani',
      category: 'chicken',
      price: 319,
      rating: '4.9',
      tag: '⭐ Popular',
      description: 'Dum-cooked basmati rice, whole spices, raita',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400'
    },

    // ── DRINKS (10) ───────────────────────────────────────────
    {
      id: 'drink-01',
      name: 'Mango Lassi',
      category: 'drinks',
      price: 99,
      rating: '4.9',
      tag: '⭐ Popular',
      description: 'Chilled Alphonso mango, yoghurt, rose water',
      image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=400'
    },
    {
      id: 'drink-02',
      name: 'Classic Cold Coffee',
      category: 'drinks',
      price: 119,
      rating: '4.8',
      tag: '☕ Coffee',
      description: 'Double-shot espresso, chilled milk, vanilla ice cream',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400'
    },
    {
      id: 'drink-03',
      name: 'Fresh Lime Soda',
      category: 'drinks',
      price: 79,
      rating: '4.7',
      tag: '🍋 Fresh',
      description: 'Squeezed lime, soda, black salt, mint',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400'
    },
    {
      id: 'drink-04',
      name: 'Strawberry Milkshake',
      category: 'drinks',
      price: 139,
      rating: '4.8',
      tag: '🍓 Sweet',
      description: 'Fresh strawberries, full-cream milk, whipped cream',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400'
    },
    {
      id: 'drink-05',
      name: 'Watermelon Cooler',
      category: 'drinks',
      price: 89,
      rating: '4.6',
      tag: '🆕 New',
      description: 'Blended watermelon, lemon, basil, crushed ice',
      image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=400'
    },
    {
      id: 'drink-06',
      name: 'Chocolate Brownie Shake',
      category: 'drinks',
      price: 159,
      rating: '4.9',
      tag: '🍫 Sweet',
      description: 'Dark chocolate, brownie chunks, Oreo, caramel drizzle',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400'
    },
    {
      id: 'drink-07',
      name: 'Virgin Mojito',
      category: 'drinks',
      price: 99,
      rating: '4.7',
      tag: '🌿 Fresh',
      description: 'Fresh mint, lime, sugar syrup, soda water',
      image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400'
    },
    {
      id: 'drink-08',
      name: 'Rose Sharbat',
      category: 'drinks',
      price: 79,
      rating: '4.5',
      tag: '🌹 Special',
      description: 'Rose syrup, chilled milk, sabja seeds, dry fruits',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400'
    },
    {
      id: 'drink-09',
      name: 'Masala Chai',
      category: 'drinks',
      price: 59,
      rating: '4.8',
      tag: '☕ Hot',
      description: 'Cardamom, ginger, cinnamon, strong CTC tea',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400'
    },
    {
      id: 'drink-10',
      name: 'Blue Lagoon Mocktail',
      category: 'drinks',
      price: 129,
      rating: '4.7',
      tag: '🆕 New',
      description: 'Blue curacao syrup, lemonade, soda, cherry garnish',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400'
    }

  ];

  /* ----------------------------------------------------------
     RENDER HELPER — shared by both API and static data
     ---------------------------------------------------------- */
  const renderFoods = (foods) => {
    menuGrid.innerHTML = foods.map((food, i) => `
      <div class="food-card reveal-up visible" data-category="${food.category}" style="transition-delay: ${0.08 * (i % 3)}s">
        <div class="food-img">
          <img src="${food.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400'}" alt="${food.name}" loading="lazy" />
          ${food.tag ? `<span class="food-tag ${food.tag.toLowerCase().includes('hot') ? 'hot' : food.tag.toLowerCase().includes('new') ? 'new' : ''}">${food.tag}</span>` : ''}
          <button class="wishlist-btn" aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="food-body">
          <div class="food-meta">
            <span class="food-cat">${food.category}</span>
            <span class="food-rating"><i class="fa-solid fa-star"></i> ${food.rating || '4.8'}</span>
          </div>
          <h3>${food.name}</h3>
          <p>${food.description || ''}</p>
          <div class="food-foot">
            <span class="food-price">₹${food.price}</span>
            <button class="add-btn"
              data-name="${food.name}"
              data-price="${food.price}"
              data-img="${food.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400'}">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    initFoodHoverEffects();
  };

  /* ----------------------------------------------------------
     TRY BACKEND FIRST — fall back to static menu
     ---------------------------------------------------------- */
  try {
    const response = await fetch('http://localhost:5000/api/foods');

    if (!response.ok) throw new Error('Backend unavailable');

    const data = await response.json();
    const foods = data.foods || data;

    if (!foods || foods.length === 0) throw new Error('Empty response');

    renderFoods(foods);

  } catch (error) {
    console.warn('Backend offline — loading static menu:', error.message);

    // ✅ Load static menu silently (no ugly error shown to user)
    renderFoods(STATIC_MENU);
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
          window.scrollTo({
            top: menu.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
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
    // Find guest buttons in mobile menu list
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
          <i class="fa-regular fa-user"></i>
          <span class="username-text">${firstName}</span>
          <i class="fa-solid fa-chevron-down trigger-chevron"></i>
        </button>
        <div class="profile-dropdown" id="profileDropdown">
          <div class="dropdown-header">
            <p class="user-name-display">${name}</p>
            <p class="user-email-display">${email}</p>
          </div>
          <hr class="dropdown-divider">
          <a href="orders.html" class="dropdown-item"><i class="fa-solid fa-receipt"></i> My Orders</a>
          <button id="logoutBtn" class="dropdown-item logout-item"><i class="fa-solid fa-sign-out-alt"></i> Logout</button>
        </div>
      `;
      // Inject before cartBtn or hamburger
      const cartBtn = qs('.cart-btn', navActions);
      if (cartBtn) {
        navActions.insertBefore(userProfileMenu, cartBtn);
      } else {
        navActions.appendChild(userProfileMenu);
      }
    }

    // Toggle Dropdown logic
    const profileTrigger = qs('#profileTrigger', userProfileMenu);
    const profileDropdown = qs('#profileDropdown', userProfileMenu);
    if (profileTrigger && profileDropdown) {
      profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userProfileMenu.classList.toggle('active');
      });

      // Click outside closes dropdown
      document.addEventListener('click', (e) => {
        if (!userProfileMenu.contains(e.target)) {
          userProfileMenu.classList.remove('active');
        }
      });
    }

    // Logout logic (desktop)
    const logoutBtn = qs('#logoutBtn', userProfileMenu);
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        showToast('Logged out successfully 👋');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      });
    }

    // 3. Mobile Navbar Drawer: Hide Guest Login/Sign Up links
    if (mobileLoginLi) mobileLoginLi.style.display = 'none';
    if (mobileSignupLi) mobileSignupLi.style.display = 'none';

    // 4. Mobile Navbar Drawer: Create and inject mobile user items
    if (navLinksList) {
      // Remove any previously injected mobile user elements to avoid duplicates
      qsa('.mobile-user-item', navLinksList).forEach(el => el.remove());

      // Profile details
      const profileLi = document.createElement('li');
      profileLi.className = 'mobile-only mobile-user-profile mobile-user-item';
      profileLi.innerHTML = `
        <div class="mobile-profile-info">
          <div class="mobile-avatar"><i class="fa-solid fa-user"></i></div>
          <div class="mobile-user-details">
            <span class="mobile-username">${name}</span>
            <span class="mobile-email">${email}</span>
          </div>
        </div>
      `;
      navLinksList.appendChild(profileLi);

      // Orders Link
      const ordersLi = document.createElement('li');
      ordersLi.className = 'mobile-only mobile-user-link mobile-user-item';
      ordersLi.innerHTML = `
        <a href="orders.html" class="nav-link"><i class="fa-solid fa-receipt"></i> My Orders</a>
      `;
      navLinksList.appendChild(ordersLi);

      // Logout Button
      const logoutLi = document.createElement('li');
      logoutLi.className = 'mobile-only mobile-user-logout mobile-user-item';
      logoutLi.innerHTML = `
        <button id="mobileLogoutBtn" class="mob-btn mob-logout"><i class="fa-solid fa-sign-out-alt"></i> Logout</button>
      `;
      navLinksList.appendChild(logoutLi);

      // Logout logic (mobile)
      const mobileLogoutBtn = qs('#mobileLogoutBtn', logoutLi);
      if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => {
          localStorage.removeItem(STORAGE_KEY);
          showToast('Logged out successfully 👋');
          setTimeout(() => {
            window.location.reload();
          }, 800);
        });
      }
    }

  } else {
    // Guest User: Ensure guest views are shown, and hide any profile remains
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

console.log(
  '%cRKR Restaurant Ultimate v5.0 🍔🔥',
  'color:#f59e0b;font-size:18px;font-weight:bold;'
);
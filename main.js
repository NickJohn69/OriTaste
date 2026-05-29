import './style.css'
// Lucide icons will be re-initialized when we construct elements dynamically

// --- Product Data ---
const products = [
  {
    id: 1,
    name: 'Premium Almonds',
    price: 1800,
    unit: '1 kg',
    image: '/images/almonds.png',
    category: 'Nuts'
  },
  {
    id: 2,
    name: 'Cashews',
    price: 2100,
    unit: '1 kg',
    image: '/images/cashews.png',
    category: 'Nuts'
  },
  {
    id: 3,
    name: 'Walnuts',
    price: 1400,
    unit: '1 kg',
    image: '/images/walnuts.png',
    category: 'Nuts'
  },
  {
    id: 4,
    name: 'Raisins',
    price: 1200,
    unit: '1 kg',
    image: '/images/raisins.png',
    category: 'Dry Fruits'
  },
  {
    id: 5,
    name: 'Pistachios',
    price: 3200,
    unit: '1 kg',
    image: '/images/pistachios.png',
    category: 'Nuts'
  },
  {
    id: 6,
    name: 'Dried Figs',
    price: 1500,
    unit: '1 kg',
    image: '/images/figs.png',
    category: 'Dry Fruits'
  },
  {
    id: 7,
    name: 'Premium Dates',
    price: 1200,
    unit: '1 kg',
    image: '/images/dates.png',
    category: 'Dry Fruits'
  },
  {
    id: 8,
    name: 'Pumpkin Seeds',
    price: 1400,
    unit: '1 kg',
    image: '/images/pumpkin.png',
    category: 'Dry Fruits'
  },
  {
    id: 9,
    name: 'Sunflower Seeds',
    price: 500,
    unit: '1 kg',
    image: '/images/sunflower.png',
    category: 'Dry Fruits'
  }
];

// --- Application State ---
let cart = []; // Array of { product, quantity }

// --- DOM Elements ---
const productGrid = document.getElementById('product-grid');
const viewAllBtn = document.getElementById('view-all-btn');
const viewAllBtnMobile = document.getElementById('view-all-btn-mobile');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const startShoppingBtn = document.getElementById('start-shopping-btn');
const toastContainer = document.getElementById('toast-container');
const orderModal = document.getElementById('order-modal');
const orderModalOverlay = document.getElementById('order-modal-overlay');
const closeOrderModal = document.getElementById('close-order-modal');
const orderForm = document.getElementById('order-form');

// ═══════════════════════════════════════════════════
// PAGE LOADER
// ═══════════════════════════════════════════════════
const dismissLoader = () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    setTimeout(() => {
      loader.remove();
      // Trigger hero animations after loader is gone
      triggerHeroAnimations();
    }, 600);
  }
};

// Dismiss loader after everything is loaded or after a max timeout
window.addEventListener('load', () => {
  setTimeout(dismissLoader, 1800);
});
// Safety fallback
setTimeout(dismissLoader, 4000);

// ═══════════════════════════════════════════════════
// HERO ANIMATIONS — triggered after loader
// ═══════════════════════════════════════════════════
const triggerHeroAnimations = () => {
  // Animate stat counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.closest('.stat-item')?.querySelector('.text-sm')?.textContent || '';
    const isHours = suffix.includes('Hours');
    const isVarieties = suffix.includes('Varieties');
    const isReviews = suffix.includes('Reviews');

    let current = 0;
    const increment = target / 40;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        // Add suffix text
        if (isHours) el.textContent = '24/7';
        else if (isVarieties) el.textContent = '100+';
        else if (isReviews) el.textContent = '5.0★';
      } else {
        el.textContent = Math.floor(current);
      }
    }, 40);
  });
};

// ═══════════════════════════════════════════════════
// PARALLAX — Scroll-linked background movement
// ═══════════════════════════════════════════════════
let lastScrollY = 0;
let ticking = false;

const updateParallax = () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.parallax-bg').forEach(el => {
    const speed = parseFloat(el.dataset.parallaxSpeed || 0.03);
    const yOffset = scrollY * speed;
    el.style.transform = `translateY(${yOffset}px)`;
  });
  ticking = false;
};

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// ═══════════════════════════════════════════════════
// SCROLL REVEAL — IntersectionObserver
// ═══════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Don't unobserve so we can re-trigger if needed? 
      // Actually unobserve for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

const initScrollReveal = () => {
  document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });
};

// ═══════════════════════════════════════════════════
// 3D PRODUCT CARD TILT
// ═══════════════════════════════════════════════════
const initCardTilt = () => {
  document.querySelectorAll('.product-card').forEach(card => {
    const inner = card.querySelector('.product-card-inner');
    const shine = card.querySelector('.product-card-shine');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Update shine position
      if (shine) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.setProperty('--shine-x', `${shineX}%`);
        shine.style.setProperty('--shine-y', `${shineY}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
};

// ═══════════════════════════════════════════════════
// MAGNETIC BUTTON EFFECT
// ═══════════════════════════════════════════════════
const initMagneticButtons = () => {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
};

// ═══════════════════════════════════════════════════
// ACTIVE NAV LINK TRACKING
// ═══════════════════════════════════════════════════
const initActiveNavTracking = () => {
  const sections = document.querySelectorAll('header[id], section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active', 'text-brand-primary');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active', 'text-brand-primary');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
};

// ═══════════════════════════════════════════════════
// FLOATING PARTICLES (hero section)
// ═══════════════════════════════════════════════════
const initParticles = () => {
  const hero = document.getElementById('home');
  if (!hero) return;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${60 + Math.random() * 40}%`;
    particle.style.width = `${3 + Math.random() * 6}px`;
    particle.style.height = particle.style.width;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.opacity = `${0.1 + Math.random() * 0.2}`;
    hero.appendChild(particle);
  }
};

// --- Functions ---
const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US');
};

window.updatePriceDisplay = (productId) => {
  const product = products.find(p => p.id === productId);
  const weightSelect = document.getElementById(`weight-${productId}`);
  const weight = parseFloat(weightSelect.value);
  const priceDisplay = document.getElementById(`price-${productId}`);
  if (priceDisplay) {
    // Animate price change
    priceDisplay.style.transform = 'scale(0.8)';
    priceDisplay.style.opacity = '0.5';
    setTimeout(() => {
      priceDisplay.textContent = `NPR ${formatCurrency(product.price * weight)}`;
      priceDisplay.style.transform = 'scale(1)';
      priceDisplay.style.opacity = '1';
    }, 150);
  }
};

let showingAllProducts = false;

const renderProducts = () => {
  const displayProducts = showingAllProducts ? products : products.slice(0, 4);
  productGrid.innerHTML = displayProducts.map(product => {
    const imgSrc = product.image ? product.image : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='%23F8F5F1'/></svg>`;
    return `
    <div class="product-card">
      <div class="product-card-inner bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col relative">
        <div class="product-card-shine"></div>
        <div class="relative h-56 bg-brand-light overflow-hidden flex items-center justify-center p-4">
          ${product.image ? `<img src="${imgSrc}" onerror="this.style.display='none'" class="product-img object-cover w-full h-full rounded-xl mix-blend-multiply" alt="${product.name}">` : `<i data-lucide="nut" class="w-16 h-16 text-brand-primary/20"></i>`}
          <div class="category-badge absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-brand-dark uppercase tracking-wider">
            ${product.category}
          </div>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <h3 class="font-serif font-bold text-lg text-brand-dark mb-1 leading-tight line-clamp-2">${product.name}</h3>
          <div class="mb-4 mt-1">
            <select id="weight-${product.id}" onchange="updatePriceDisplay(${product.id})" class="weight-select text-sm border border-gray-200 rounded-md py-1 px-2 focus:outline-none focus:border-brand-primary bg-gray-50 text-brand-dark cursor-pointer hover:bg-gray-100">
              <option value="1">1 kg</option>
              <option value="0.5">0.5 kg</option>
            </select>
          </div>
          <div class="mt-auto flex items-center justify-between">
            <span id="price-${product.id}" class="font-bold text-lg transition-all duration-200">NPR ${formatCurrency(product.price)}</span>
            <button onclick="addToCart(${product.id}, event)" class="add-btn w-10 h-10 rounded-full bg-brand-light text-brand-dark flex items-center justify-center hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
              <i data-lucide="plus" class="w-5 h-5 pointer-events-none"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `}).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Re-initialize card tilt and magnetic buttons for new elements
  initCardTilt();

  // Re-observe the product grid for stagger animation
  const grid = document.getElementById('product-grid');
  if (grid) {
    // Reset children visibility for stagger animation
    grid.classList.remove('revealed');
    void grid.offsetWidth; // force reflow
    revealObserver.observe(grid);
  }
};

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'bg-brand-dark text-white px-6 py-3 rounded-xl shadow-lg transform translate-x-full opacity-0 transition-all duration-300 flex items-center gap-3 font-medium text-sm';
  toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-brand-primary"></i> ${message}`;

  toastContainer.appendChild(toast);
  if (window.lucide) { window.lucide.createIcons(); }

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// ═══════════════════════════════════════════════════
// ADD TO CART — with ripple + fly-to-cart animation
// ═══════════════════════════════════════════════════
window.addToCart = (productId, event) => {
  const product = products.find(p => p.id === productId);
  const weightSelect = document.getElementById(`weight-${productId}`);
  const weight = weightSelect ? parseFloat(weightSelect.value) : 1;
  const unitLabel = weight === 1 ? '1 kg' : '0.5 kg';
  const price = product.price * weight;
  const cartItemId = `${productId}-${weight}`;

  const existingItem = cart.find(item => item.cartItemId === cartItemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ cartItemId, product, quantity: 1, weight, unitLabel, price });
  }

  // Ripple effect on the add button
  if (event) {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.style.width = ripple.style.height = '20px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    // Fly-to-cart animation
    createFlyElement(btn, product);
  }

  // Pulse the cart badge
  cartCount.classList.add('cart-badge-pulse');
  setTimeout(() => cartCount.classList.remove('cart-badge-pulse'), 600);

  updateCartUI();
  showToast(`${product.name} (${unitLabel}) added to cart`);
};

// Create a small flying element from button to cart icon
const createFlyElement = (sourceBtn, product) => {
  const cartIcon = document.getElementById('cart-toggle');
  if (!cartIcon) return;

  const sourceRect = sourceBtn.getBoundingClientRect();
  const targetRect = cartIcon.getBoundingClientRect();

  const flyEl = document.createElement('div');
  flyEl.className = 'fly-to-cart';
  flyEl.style.left = `${sourceRect.left}px`;
  flyEl.style.top = `${sourceRect.top}px`;
  flyEl.style.width = '24px';
  flyEl.style.height = '24px';
  flyEl.style.borderRadius = '50%';
  flyEl.style.background = '#C97A34';

  document.body.appendChild(flyEl);

  // Animate to cart position
  requestAnimationFrame(() => {
    flyEl.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    flyEl.style.left = `${targetRect.left + targetRect.width / 2 - 12}px`;
    flyEl.style.top = `${targetRect.top + targetRect.height / 2 - 12}px`;
    flyEl.style.transform = 'scale(0.2)';
    flyEl.style.opacity = '0';
  });

  setTimeout(() => flyEl.remove(), 800);
};

window.updateQuantity = (cartItemId, change) => {
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    updateCartUI();
  }
};

window.removeFromCart = (cartItemId) => {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  updateCartUI();
};

const updateCartUI = () => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update badge
  if (totalItems > 0) {
    cartCount.classList.remove('scale-0');
    cartCount.classList.add('scale-100');
    cartCount.textContent = totalItems;

    // Bounce effect
    cartCount.classList.add('animate-bounce-short');
    setTimeout(() => cartCount.classList.remove('animate-bounce-short'), 300);
  } else {
    cartCount.classList.remove('scale-100');
    cartCount.classList.add('scale-0');
  }

  cartTotal.textContent = formatCurrency(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-brand-dark/50 gap-4 opacity-70">
        <i data-lucide="shopping-cart" class="w-16 h-16 mb-2"></i>
        <p>Your cart is empty.</p>
        <button onclick="document.getElementById('cart-close').click(); document.getElementById('shop').scrollIntoView({behavior: 'smooth'})" class="mt-4 px-6 py-2 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primaryDark transition-colors magnetic-btn">Start Shopping</button>
      </div>
    `;
    checkoutBtn.disabled = true;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-4 items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm animate-fade-in">
        <div class="w-16 h-16 bg-brand-light rounded-lg flex items-center justify-center overflow-hidden">
           ${item.product.image ? `<img src="${item.product.image}" class="w-full h-full object-cover">` : `<i data-lucide="nut" class="w-8 h-8 text-brand-primary/20"></i>`}
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-sm text-brand-dark leading-tight">${item.product.name}</h4>
          <span class="text-xs text-gray-500">${item.unitLabel}</span>
          <div class="font-bold text-brand-dark text-sm mt-1">NPR ${formatCurrency(item.price * item.quantity)}</div>
        </div>
        <div class="flex flex-col items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 w-8">
          <button onclick="updateQuantity('${item.cartItemId}', 1)" class="w-full h-7 flex flex-col items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
             <i data-lucide="plus" class="w-3 h-3 pointer-events-none"></i>
          </button>
          <span class="text-xs font-semibold w-full text-center py-1 bg-white border-y border-gray-200">${item.quantity}</span>
          <button onclick="updateQuantity('${item.cartItemId}', -1)" class="w-full h-7 flex flex-col items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
            <i data-lucide="minus" class="w-3 h-3 pointer-events-none"></i>
          </button>
        </div>
      </div>
    `).join('');
    checkoutBtn.disabled = false;
  }

  if (window.lucide) { window.lucide.createIcons(); }
};

// --- Event Listeners ---
const toggleProducts = (e) => {
  if (e) e.preventDefault();
  showingAllProducts = !showingAllProducts;
  renderProducts();

  const lessHtml = `Show Less <i data-lucide="arrow-up" class="w-4 h-4 transform group-hover:-translate-y-1 transition-transform"></i>`;
  const moreHtml = `View All <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"></i>`;
  const mobileMoreHtml = `View All <i data-lucide="arrow-down" class="w-4 h-4 transform group-hover:translate-y-1 transition-transform"></i>`;

  if (viewAllBtn) {
    viewAllBtn.innerHTML = showingAllProducts ? lessHtml : moreHtml;
  }
  if (viewAllBtnMobile) {
    viewAllBtnMobile.innerHTML = showingAllProducts ? lessHtml : mobileMoreHtml;
  }

  if (window.lucide) { window.lucide.createIcons(); }
};

if (viewAllBtn) {
  viewAllBtn.addEventListener('click', toggleProducts);
}
if (viewAllBtnMobile) {
  viewAllBtnMobile.addEventListener('click', toggleProducts);
}



const openCart = () => {
  cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
  cartSidebar.classList.remove('translate-x-full');
};

const closeCart = () => {
  cartOverlay.classList.add('opacity-0', 'pointer-events-none');
  cartSidebar.classList.add('translate-x-full');
};

const openOrderModal = () => {
  closeCart();
  orderModalOverlay.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    orderModal.classList.remove('scale-95', 'opacity-0');
    orderModal.classList.add('scale-100', 'opacity-100');
  }, 10);
};

const closeOrderModalUI = () => {
  orderModal.classList.remove('scale-100', 'opacity-100');
  orderModal.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    orderModalOverlay.classList.add('opacity-0', 'pointer-events-none');
  }, 300);
};

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  if (cart.length > 0) {
    openOrderModal();
  }
});

closeOrderModal.addEventListener('click', closeOrderModalUI);
orderModalOverlay.addEventListener('click', (e) => {
  if (e.target === orderModalOverlay) closeOrderModalUI();
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = orderForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span class="animate-pulse">Processing Order...</span>`;
  submitBtn.disabled = true;

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  // Format order details for the email
  const orderItemsHTML = cart.map(item => `${item.quantity}x ${item.product.name} [${item.unitLabel}] (NPR ${formatCurrency(item.price * item.quantity)})`).join('\\n');
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const emailPayload = {
    _subject: `New Order from ${name} - Ori Taste!`,
    Name: name,
    Phone: phone,
    Address: address,
    Total_Amount: `NPR ${formatCurrency(totalPrice)}`,
    Order_Details: orderItemsHTML
  };

  try {
    const response = await fetch("https://formsubmit.co/ajax/nickjohnpokharel13@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    if (result.success !== "true" && response.status !== 200) {
      console.warn("FormSubmit notice:", result);
    }

    // Close checkout and clear cart
    closeOrderModalUI();
    cart = [];
    updateCartUI();

    // Custom Success state
    setTimeout(() => {
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center z-50 animate-fade-in-up text-center w-11/12 max-w-sm';
      successToast.innerHTML = `
        <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
          <i data-lucide="check" class="w-8 h-8"></i>
        </div>
        <h3 class="font-serif text-2xl font-bold mb-2">Order Confirmed!</h3>
        <p class="text-gray-500 text-sm mb-6">Thank you, ${name.split(' ')[0]}. We will contact you shortly to confirm delivery.</p>
        <button id="close-success" class="px-8 py-3 w-full bg-brand-dark text-white rounded-full font-medium hover:bg-brand-dark/90 transition-colors magnetic-btn">Continue Shopping</button>
      `;
      document.body.appendChild(successToast);

      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 fade-in';
      document.body.appendChild(overlay);

      if (window.lucide) { window.lucide.createIcons(); }

      document.getElementById('close-success').addEventListener('click', () => {
        successToast.remove();
        overlay.remove();
      });
    }, 500);

  } catch (error) {
    console.error('Error submitting order:', error);
    alert('There was an issue submitting your order. Please check your internet connection and try again.');
  } finally {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
});

// Scroll Effects for Navbar
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.classList.add('shadow-md', 'py-3');
    navbar.classList.remove('py-4');
  } else {
    navbar.classList.remove('shadow-md', 'py-3');
    navbar.classList.add('py-4');
  }
});

if (startShoppingBtn) {
  startShoppingBtn.addEventListener('click', () => {
    closeCart();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });
}

// Add animation keyframes to document head dynamically
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translate(-50%, -40%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
  @keyframes bounce-short {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  .animate-bounce-short { animation: bounce-short 0.3s ease-out; }
`;
document.head.appendChild(style);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initScrollReveal();
  initMagneticButtons();
  initActiveNavTracking();
  initParticles();
});

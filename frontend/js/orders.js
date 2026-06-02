/* ============================================================
   RKR RESTAURANT — SECURE CHECKOUT & ORDERS SYSTEM
   ============================================================ */

'use strict';

const STORAGE_KEY = 'rkr-cart';
const LAST_ORDER_KEY = 'last-order';

document.addEventListener('DOMContentLoaded', () => {

    let cart = getCart();

    // DOM ELEMENTS
    const itemsCountEl = document.getElementById('order-items-count');
    const itemsContainer = document.getElementById('order-items-container');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery');
    const gstEl = document.getElementById('checkout-gst');
    const discountEl = document.getElementById('checkout-discount');
    const totalEl = document.getElementById('checkout-total');

    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const deliveryForm = document.getElementById('deliveryForm');
    const paymentMethodsContainer = document.getElementById('payment-methods');

    let activeDiscount = 0;
    let activeCouponCode = '';

    // Initialize Page
    renderCheckout();

    /* ==========================================
       GET CART
       ========================================== */
    function getCart() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            return stored.map(item => ({
                id: item.id || item.name,
                name: item.name,
                price: Number(item.price),
                image: item.image || item.img || '',
                quantity: Number(item.quantity || item.qty || 1),
                description: item.description || ''
            }));
        } catch {
            return [];
        }
    }

    /* ==========================================
       SAVE CART
       ========================================== */
    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    /* ==========================================
       RENDER CHECKOUT ITEMS & CALC TOTALS
       ========================================== */
    function renderCheckout() {
        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #a1a1aa;">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 40px; margin-bottom: 15px; display: block; color: var(--primary);"></i>
                    <p>Your checkout session is empty.</p>
                    <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 15px; text-decoration: none;">Browse Menu</a>
                </div>
            `;
            if (itemsCountEl) itemsCountEl.textContent = '0 Items';
            updateTotals(0);
            return;
        }

        // Update items count
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (itemsCountEl) {
            itemsCountEl.textContent = `${totalQty} ${totalQty === 1 ? 'Item' : 'Items'}`;
        }

        // Render food items
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-content">
                    <div class="cart-top">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${item.description || 'Premium freshly crafted dish'}</p>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <div class="cart-bottom">
                        <div class="qty-box">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span class="qty">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <div class="price">₹${item.price * item.quantity}</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Calculate subtotal
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        updateTotals(subtotal);
        bindCheckoutActions();
    }

    /* ==========================================
       CALCULATE AND UPDATE PRICING
       ========================================== */
    function updateTotals(subtotal) {
        if (subtotal === 0) {
            if (subtotalEl) subtotalEl.textContent = '₹0';
            if (deliveryEl) deliveryEl.textContent = '₹50';
            if (gstEl) gstEl.textContent = '₹0';
            if (discountEl) discountEl.textContent = '-₹0';
            if (totalEl) totalEl.textContent = '₹0';
            return;
        }

        const deliveryFee = 50;
        const gstRate = 0.05;

        // Recalculate discount based on coupon codes
        if (activeCouponCode === 'RKR50') {
            activeDiscount = 50;
        } else if (activeCouponCode === 'WELCOME10') {
            activeDiscount = Math.round(subtotal * 0.10);
        } else {
            activeDiscount = 0;
        }

        const discountedSubtotal = Math.max(0, subtotal - activeDiscount);
        const gstAmount = Math.round(discountedSubtotal * gstRate);
        const grandTotal = discountedSubtotal + deliveryFee + gstAmount;

        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
        if (deliveryEl) deliveryEl.textContent = `₹${deliveryFee}`;
        if (gstEl) gstEl.textContent = `₹${gstAmount}`;
        if (discountEl) discountEl.textContent = `-₹${activeDiscount}`;
        if (totalEl) totalEl.textContent = `₹${grandTotal}`;
    }

    /* ==========================================
       BIND INCREMENT / DECREMENT / REMOVE ACTIONS
       ========================================== */
    function bindCheckoutActions() {
        // Quantity Plus
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    saveCart();
                    renderCheckout();
                }
            });
        });

        // Quantity Minus
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity--;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    saveCart();
                    renderCheckout();
                }
            });
        });

        // Remove button
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const itemEl = btn.closest('.cart-item');
                if (itemEl) {
                    itemEl.style.opacity = '0';
                    itemEl.style.transform = 'translateX(40px)';
                    itemEl.style.transition = 'all 0.3s ease';

                    setTimeout(() => {
                        cart = cart.filter(i => i.id !== id);
                        saveCart();
                        renderCheckout();
                    }, 300);
                }
            });
        });
    }

    /* ==========================================
       COUPON PROMO CODES
       ========================================== */
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();

            if (cart.length === 0) {
                alert('Add items to your cart first!');
                return;
            }

            if (code === 'RKR50') {
                activeCouponCode = 'RKR50';
                alert('Coupon code applied! Flat ₹50 discount added 🎉');
            } else if (code === 'WELCOME10') {
                activeCouponCode = 'WELCOME10';
                alert('Coupon code applied! 10% discount on dishes added 🎉');
            } else if (code === '') {
                activeCouponCode = '';
                alert('Coupon cleared.');
            } else {
                alert('Invalid Coupon Code! Try RKR50 or WELCOME10.');
                activeCouponCode = '';
                couponInput.value = '';
            }

            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            updateTotals(subtotal);
        });
    }

    /* ==========================================
       PAYMENT OPTION SELECT
       ========================================== */
    if (paymentMethodsContainer) {
        const paymentOptions = paymentMethodsContainer.querySelectorAll('.payment-option');
        paymentOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
        });
    }

    /* ==========================================
       PLACE ORDER
       ========================================== */
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert('Cart is empty');
                return;
            }

            const name    = document.getElementById('delivery-name').value.trim();
            const email   = document.getElementById('delivery-email').value.trim();
            const phone   = document.getElementById('delivery-phone').value.trim();
            const address = document.getElementById('delivery-address').value.trim();

            if (!name || !email || !phone || !address) {
                alert('Please fill in all delivery fields.');
                return;
            }

            // Basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Basic phone validation (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                alert('Please login first.');
                return;
            }

            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const deliveryFee = 50;

            // ✅ Consistent with updateTotals() — GST applied on discounted subtotal
            const discountedSubtotal = Math.max(0, subtotal - activeDiscount);
            const gst = Math.round(discountedSubtotal * 0.05);
            const total = discountedSubtotal + deliveryFee + gst;

            // Disable button to prevent double submission
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Placing Order...';

            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        items: cart.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image || item.img || '',
                            description: item.description || ''
                        })),
                        totalAmount: total,
                        couponCode: activeCouponCode || null,
                        discount: activeDiscount,
                        deliveryInfo: { name, email, phone, address }
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Order placement failed.');
                }

                // ✅ Use constants instead of magic strings
                localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data.order));
                localStorage.removeItem(STORAGE_KEY);

                alert('Order placed successfully! 🎉');
                window.location.href = 'success.html';

            } catch (err) {
                console.error('Order Error:', err);
                alert(`Order failed: ${err.message}`);
            } finally {
                // Re-enable button in case user stays on page
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        });
    }

});
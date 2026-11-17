/* ============================================================
   RKR RESTAURANT — ULTRA-PERFORMANCE CART SYSTEM
   ============================================================ */

'use strict';

const STORAGE_KEY = 'rkr-cart';
const LEGACY_DUMMIES = ['cheese burger', 'italian pizza', 'burger', 'pizza', 'demo item'];

/**
 * Filter out legacy dummy items, corrupted entries, and ensure valid dish schema
 */
function sanitizeCart(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(item => {
        if (!item || !item.name) return false;
        const name = String(item.name).toLowerCase().trim();
        // Remove old unwanted seeded dummy items
        if (LEGACY_DUMMIES.includes(name)) return false;
        const price = Number(item.price);
        if (isNaN(price) || price <= 0) return false;
        return true;
    }).map(item => ({
        id: item.id || item.name,
        name: String(item.name).trim(),
        price: Number(item.price),
        image: item.image || item.img || 'images/dishes/hyderabadi_biryani.jpg',
        img: item.img || item.image || 'images/dishes/hyderabadi_biryani.jpg',
        quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
        qty: Math.max(1, Number(item.qty || item.quantity || 1)),
        description: item.description || ''
    }));
}

/**
 * Load cart from storage, automatically purging phantom/demo dishes
 */
function getCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const cleaned = sanitizeCart(stored);
        if (cleaned.length !== stored.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
    } catch {
        return [];
    }
}

let cart = getCart();

/**
 * Save sanitized cart to localStorage and sync badges
 */
function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
}

/**
 * Synchronize all header and page cart badges
 */
function updateCartBadges() {
    const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const badges = document.querySelectorAll('#cartBadge, #cart-count, .cart-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
    });
}

/**
 * Fast, GPU-friendly single-pass DOM rendering
 */
function renderCart() {
    cart = getCart();

    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const summaryCol = document.getElementById("cartSummaryCol");
    const clearBtn = document.getElementById("clearCartBtn");
    const subtotalEl = document.getElementById("subtotal");
    const gstEl = document.getElementById("gst");
    const deliveryTag = document.getElementById("deliveryTag");
    const totalEl = document.getElementById("total");
    const summaryBadge = document.getElementById("summaryBadge");

    updateCartBadges();

    if (!cartItems) return;

    // Handle Empty Cart State
    if (cart.length === 0) {
        cartItems.innerHTML = "";
        if (emptyCart) emptyCart.style.display = "flex";
        if (summaryCol) summaryCol.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
        return;
    }

    if (emptyCart) emptyCart.style.display = "none";
    if (summaryCol) summaryCol.style.display = "block";
    if (clearBtn) clearBtn.style.display = "inline-flex";

    let subtotal = 0;
    let totalQty = 0;
    let itemsHtml = '';

    cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;
        totalQty += item.quantity;

        itemsHtml += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-left">
                    <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                        class="item-image"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='images/dishes/hyderabadi_biryani.jpg';"
                    />
                    <div class="item-details">
                        <div class="item-title-row">
                            <h3>${item.name}</h3>
                        </div>
                        ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
                        <div class="price-pill">
                            <span class="price-val">₹${item.price}</span>
                            <span class="price-sub">per portion</span>
                        </div>
                    </div>
                </div>

                <div class="item-actions">
                    <div class="quantity-box">
                        <button 
                            type="button"
                            class="qty-btn minus"
                            onclick="changeQuantity('${item.id}', -1)"
                            aria-label="Decrease portion"
                            title="Decrease portion"
                        >
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button 
                            type="button"
                            class="qty-btn plus"
                            onclick="changeQuantity('${item.id}', 1)"
                            aria-label="Increase portion"
                            title="Increase portion"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    <div class="item-subtotal-block">
                        <span class="subtotal-label">Subtotal</span>
                        <strong class="subtotal-val">₹${lineTotal}</strong>
                    </div>

                    <button 
                        type="button"
                        class="remove-btn"
                        onclick="removeItem('${item.id}')"
                        title="Remove dish"
                        aria-label="Remove dish"
                    >
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = itemsHtml;

    // Delivery calculation: Free if subtotal >= 800, else 50
    const deliveryFee = subtotal >= 800 ? 0 : 50;
    const gstAmount = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + deliveryFee + gstAmount;

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
    if (gstEl) gstEl.innerText = `₹${gstAmount}`;
    if (deliveryTag) {
        if (deliveryFee === 0) {
            deliveryTag.innerHTML = `<span class="badge-free"><i class="fa-solid fa-check"></i> FREE</span>`;
        } else {
            deliveryTag.innerText = `₹${deliveryFee}`;
        }
    }
    if (totalEl) totalEl.innerText = `₹${grandTotal}`;
    if (summaryBadge) {
        summaryBadge.innerText = `${totalQty} ${totalQty === 1 ? 'Dish' : 'Dishes'}`;
    }
}

/**
 * Portion modifier with auto-remove at zero
 */
window.changeQuantity = function(id, delta) {
    cart = cart.map(item => {
        if (item.id === id || item.name === id) {
            item.quantity = Number(item.quantity || 1) + delta;
            item.qty = item.quantity;
        }
        return item;
    }).filter(item => item.quantity > 0);

    saveCart();
    renderCart();
};

/**
 * Remove individual dish
 */
window.removeItem = function(id) {
    const item = cart.find(i => i.id === id || i.name === id);
    cart = cart.filter(i => i.id !== id && i.name !== id);
    saveCart();
    renderCart();
    if (typeof showToast === 'function') {
        showToast(item ? `Removed ${item.name} from cart` : 'Dish removed from cart');
    }
};

/**
 * Empty entire cart with confirmation
 */
window.clearCart = function() {
    if (!cart.length) return;
    if (confirm("Are you sure you want to clear all dishes from your cart?")) {
        cart = [];
        localStorage.removeItem(STORAGE_KEY);
        renderCart();
        if (typeof showToast === 'function') {
            showToast("Cart cleared 🗑️");
        }
    }
};

/**
 * Proceed to Checkout
 */
window.checkout = function() {
    if (!cart || cart.length === 0) {
        alert("Your cart is empty! Please add delicious dishes before checking out.");
        return;
    }
    window.location.href = "orders.html";
};

// Initial Render on load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
// Execute immediately in case DOM is already ready
renderCart();

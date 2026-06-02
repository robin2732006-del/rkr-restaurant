/* ============================================================
   RKR RESTAURANT — CART SYSTEM
   ============================================================ */

'use strict';

/* ============================================================
   STORAGE
   ============================================================ */

const STORAGE_KEY = 'rkr-cart';

/* ============================================================
   GET CART
   ============================================================ */

function getCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
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
}

let cart = getCart();

/* ============================================================
   DEMO ITEMS (ONLY FIRST TIME)
   ============================================================ */

if (cart.length === 0) {

    cart = [
        {
            id: "Cheese Burger",
            name: "Cheese Burger",
            price: 199,
            quantity: 1,
            qty: 1,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000",
            img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000",
            description: "Delicious cheesy burger"
        },
        {
            id: "Italian Pizza",
            name: "Italian Pizza",
            price: 349,
            quantity: 2,
            qty: 2,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
            img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
            description: "Hot & crispy pizza"
        }
    ];

    saveCart();

}

/* ============================================================
   ELEMENTS
   ============================================================ */

const cartItems = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const gstElement = document.getElementById("gst");
const totalElement = document.getElementById("total");
const emptyCart = document.getElementById("empty-cart");
const summaryBox = document.querySelector(".cart-summary");
const cartCount = document.getElementById("cart-count");

/* ============================================================
   SAVE CART
   ============================================================ */

function saveCart() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
    );

}

/* ============================================================
   UPDATE BADGE
   ============================================================ */

function updateCartCount() {

    if (!cartCount) return;

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.innerText = totalItems;

}

/* ============================================================
   RENDER CART
   ============================================================ */

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    updateCartCount();

    /* EMPTY CART */

    if (cart.length === 0) {

        if (emptyCart) {
            emptyCart.style.display = "flex";
        }

        if (summaryBox) {
            summaryBox.style.display = "none";
        }

        saveCart();

        return;

    }

    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    if (summaryBox) {
        summaryBox.style.display = "block";
    }

    let subtotal = 0;

    /* LOOP ITEMS */

    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `
        
        <div class="cart-item">

            <div class="item-left">

                <img 
                    src="${item.image}" 
                    alt="${item.name}"
                    class="item-image"
                >

                <div class="item-details">

                    <h3>${item.name}</h3>

                    <p>${item.description}</p>

                    <span class="price">
                        ₹${item.price}
                    </span>

                </div>

            </div>

            <div class="quantity-box">

                <button 
                    class="qty-btn"
                    onclick="changeQuantity('${item.id}', -1)"
                >
                    -
                </button>

                <span class="quantity">
                    ${item.quantity}
                </span>

                <button 
                    class="qty-btn"
                    onclick="changeQuantity('${item.id}', 1)"
                >
                    +
                </button>

            </div>

            <button 
                class="remove-btn"
                onclick="removeItem('${item.id}')"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;

    });

    /* TOTALS */

    const deliveryCharge = 50;
    const gstRate = 0.05;
    const gstAmount = Math.round(subtotal * gstRate);
    const grandTotal = subtotal + deliveryCharge + gstAmount;

    if (subtotalElement) {
        subtotalElement.innerText = `₹${subtotal}`;
    }

    if (gstElement) {
        gstElement.innerText = `₹${gstAmount}`;
    }

    if (totalElement) {
        totalElement.innerText = `₹${grandTotal}`;
    }

    saveCart();

}

/* ============================================================
   CHANGE QUANTITY
   ============================================================ */

window.changeQuantity = function(id, value) {

    cart = cart.map(item => {

        if (item.id === id) {

            item.quantity += value;
            item.qty = item.quantity;

            if (item.quantity < 1) {
                item.quantity = 1;
                item.qty = 1;
            }

        }

        return item;

    });

    renderCart();

};

/* ============================================================
   REMOVE ITEM
   ============================================================ */

window.removeItem = function(id) {

    cart = cart.filter(item => item.id !== id);

    renderCart();

};

/* ============================================================
   CLEAR CART
   ============================================================ */

window.clearCart = function() {

    cart = [];

    renderCart();

};

/* ============================================================
   CHECKOUT
   ============================================================ */

window.checkout = function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    // Redirect to dynamic secure orders/checkout page!
    window.location.href = "orders.html";

};

/* ============================================================
   INITIALIZE
   ============================================================ */

renderCart();

console.log(
    "%cRKR Cart System Loaded 🛒",
    "color:#f59e0b;font-size:16px;font-weight:bold;"
);
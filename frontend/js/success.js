document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    const randomInt = (min, max) =>
        Math.floor(random(min, max));

    const card = $(".success-card");

    if (!card) return;

    const orderId = $("#orderId");
    const deliveryTime = $("#deliveryTime");
    const liveText = $(".live-box strong");
    const trackerSteps = $$(".tracker-step");
    const trackerProgress = $(".tracker-progress");
    const particles = $(".particles");

    const buttons = $$(`
        .primary-btn,
        .secondary-btn,
        .support-btn,
        .change-btn
    `);

    /* ==========================
       LOAD ORDER
    ========================== */

    let lastOrder = null;

    try {
        lastOrder = JSON.parse(
            localStorage.getItem("last-order")
        );
    } catch (err) {
        console.error(err);
    }

    /* ==========================
       ORDER ID
    ========================== */

    function generateOrderId() {

        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let id = "#RKR";

        for (let i = 0; i < 7; i++) {
            id += chars[
                Math.floor(
                    Math.random() * chars.length
                )
            ];
        }

        return id;
    }

    if (orderId) {
        orderId.textContent =
            lastOrder?._id || lastOrder?.id || generateOrderId();
    }

    /* ==========================
       ADDRESS
    ========================== */

    const address =
        $("#success-address");

    if (address) {
        address.textContent =
            lastOrder?.deliveryInfo?.address || lastOrder?.address || "Address not provided";
    }

    /* =========================================================
       CHANGE DELIVERY ADDRESS HANDLER
    ========================================================= */
    const changeBtn = $(".change-btn");
    if (changeBtn && address) {
        changeBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const currentAddress = address.textContent.trim();
            const defaultPrompt = (currentAddress && currentAddress !== "Address not provided") ? currentAddress : "";
            
            const newAddress = window.prompt("📍 Enter updated delivery address for this order:", defaultPrompt);
            
            if (newAddress !== null && newAddress.trim() !== "") {
                const trimmed = newAddress.trim();
                address.textContent = trimmed;
                
                // 1. Update in local storage
                try {
                    let orderData = JSON.parse(localStorage.getItem("last-order")) || {};
                    if (!orderData.deliveryInfo) orderData.deliveryInfo = {};
                    orderData.deliveryInfo.address = trimmed;
                    orderData.address = trimmed;
                    localStorage.setItem("last-order", JSON.stringify(orderData));
                } catch (err) {
                    console.error("Local storage address update error:", err);
                }

                // 2. Update on server if order ID exists
                try {
                    const orderDbId = lastOrder?._id || lastOrder?.id;
                    if (orderDbId && !orderDbId.toString().startsWith("#")) {
                        const apiBase = (typeof getApiUrl === "function") 
                            ? getApiUrl(`/api/orders/${orderDbId}`) 
                            : `/api/orders/${orderDbId}`;
                        await fetch(apiBase, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ "deliveryInfo.address": trimmed, address: trimmed })
                        }).catch(() => {});
                    }
                } catch (err) {
                    console.error("Server order address update error:", err);
                }

                // 3. Update user profile in database if logged in
                try {
                    const userData = JSON.parse(localStorage.getItem("user"));
                    const token = userData?.token;
                    if (token) {
                        const profileUrl = (typeof getApiUrl === "function") 
                            ? getApiUrl("/api/auth/profile") 
                            : "/api/auth/profile";
                        await fetch(profileUrl, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ address: trimmed })
                        }).catch(() => {});
                    }
                } catch (err) {
                    console.error("Profile address update error:", err);
                }

                // Visual feedback: temporarily switch button to Saved!
                const originalText = changeBtn.innerHTML;
                changeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
                changeBtn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
                setTimeout(() => {
                    changeBtn.innerHTML = originalText;
                    changeBtn.style.background = "";
                }, 2000);
            }
        });
    }

    /* ==========================
       ORDER ITEMS
    ========================== */

    const IMAGE_MAPPING = {};
    if (window.STATIC_MENU && Array.isArray(window.STATIC_MENU)) {
        window.STATIC_MENU.forEach(item => {
            IMAGE_MAPPING[item.name] = item.image;
        });
    };

    const container =
        $("#success-items-container");

    if (
        container &&
        lastOrder?.items &&
        Array.isArray(lastOrder.items) &&
        lastOrder.items.length > 0
    ) {

        const validItems = lastOrder.items.filter(item => item !== null && typeof item === 'object');

        const totalQty =
            validItems.reduce(
                (sum, item) =>
                    sum + (Number(item.quantity) || 0),
                0
            );

        container.innerHTML = `
            <div class="items-header">
                <h3>Order Summary</h3>
                <span>${totalQty} Items</span>
            </div>

            ${validItems.map(item => {
                const matchedImg = item.image || item.img || IMAGE_MAPPING[item.name] || 'images/dishes/hyderabadi_biryani.jpg';
                return `
                <div class="food-item">

                    <div class="food-left">

                        <div class="food-image">

                            <img
                                src="${matchedImg}"
                                alt="${item.name || 'Dish'}"
                                onerror="this.src='images/dishes/hyderabadi_biryani.jpg'"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:contain;
                                    background:rgba(255, 255, 255, 0.05);
                                    border-radius:16px;
                                "
                            >

                        </div>

                        <div>
                            <h4>${item.name || 'Premium Dish'}</h4>

                            <p>
                                ${(Number(item.quantity) || 0)} × ₹${(Number(item.price) || 0)}
                            </p>
                        </div>

                    </div>

                    <strong>
                        ₹${(Number(item.price) || 0) * (Number(item.quantity) || 0)}
                    </strong>

                </div>
                `;
            }).join("")}
        `;
    }

    /* ==========================
       DELIVERY TIME
    ========================== */

    if (deliveryTime) {

        const min =
            randomInt(20, 30);

        const max =
            min + randomInt(5, 10);

        deliveryTime.textContent =
            `${min}-${max} Mins`;
    }

    /* ==========================
       TRACKER
    ========================== */

    const updates = [

        {
            text: "Order confirmed",
            progress: 25
        },

        {
            text: "Preparing meal",
            progress: 50
        },

        {
            text: "Packed successfully",
            progress: 75
        },

        {
            text: "Out for delivery",
            progress: 100
        }
    ];

    let step = 0;

    function updateTracker() {

        if (step >= updates.length)
            return;

        const update =
            updates[step];

        if (liveText)
            liveText.textContent =
                update.text;

        if (trackerProgress)
            trackerProgress.style.width =
                `${update.progress}%`;

        if (trackerSteps[step]) {
            trackerSteps[step]
                .classList.add("active");
        }

        step++;
    }

    setTimeout(updateTracker, 1500);
    setTimeout(updateTracker, 4500);
    setTimeout(updateTracker, 7500);
    setTimeout(updateTracker, 10500);

    /* ==========================
       CARD ANIMATION
    ========================== */

    card.animate([
        {
            opacity: 0,
            transform:
                "translateY(60px)"
        },
        {
            opacity: 1,
            transform:
                "translateY(0)"
        }
    ], {
        duration: 1200,
        fill: "forwards",
        easing:
            "cubic-bezier(.16,1,.3,1)"
    });

    /* ==========================
       BUTTON RIPPLE
    ========================== */

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            e => {

                const ripple =
                    document.createElement("span");

                ripple.className =
                    "premium-ripple";

                const rect =
                    button.getBoundingClientRect();

                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );

                ripple.style.width =
                    ripple.style.height =
                    `${size}px`;

                ripple.style.left =
                    `${e.clientX - rect.left - size / 2}px`;

                ripple.style.top =
                    `${e.clientY - rect.top - size / 2}px`;

                button.appendChild(
                    ripple
                );

                setTimeout(() => {
                    ripple.remove();
                }, 700);
            }
        );
    });

    /* ==========================
       SUCCESS ICON
    ========================== */

    const successIcon =
        $(".icon-center");

    if (successIcon) {

        successIcon.animate([
            {
                transform:
                    "scale(.5) rotate(-180deg)",
                opacity: 0
            },
            {
                transform:
                    "scale(1.15) rotate(10deg)",
                opacity: 1
            },
            {
                transform:
                    "scale(1)"
            }
        ], {
            duration: 1800,
            fill: "forwards"
        });
    }

    /* ==========================
       LIVE DOT
    ========================== */

    const liveDot =
        $(".live-dot");

    if (liveDot) {

        setInterval(() => {

            liveDot.animate([
                {
                    transform:
                        "scale(1)"
                },
                {
                    transform:
                        "scale(1.8)"
                },
                {
                    transform:
                        "scale(1)"
                }
            ], {
                duration: 1000
            });

        }, 1200);
    }

    /* ==========================
       PARTICLES
    ========================== */

    if (particles) {

        setInterval(() => {

            const p =
                document.createElement("span");

            p.className =
                "dynamic-particle";

            p.style.left =
                `${Math.random() * 100}%`;

            particles.appendChild(p);

            setTimeout(() => {
                p.remove();
            }, 10000);

        }, 600);
    }

});
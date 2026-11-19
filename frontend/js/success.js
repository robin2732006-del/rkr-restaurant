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

    const defaultInitialAddress = "58, K N Palayam Road, Periya Kodeveri, Gobi, Erode";

    if (address) {
        address.textContent =
            lastOrder?.deliveryInfo?.address || lastOrder?.address || defaultInitialAddress;
    }

    /* =========================================================
       CHANGE DELIVERY ADDRESS MODAL HANDLER
    ========================================================= */
    const changeBtn = $("#changeAddressBtn") || $(".change-btn");
    const addressModal = $("#addressModal");
    const closeAddressModal = $("#closeAddressModal");
    const cancelAddressBtn = $("#cancelAddressBtn");
    const saveAddressBtn = $("#saveAddressBtn");
    const modalAddressInput = $("#modalAddressInput");
    const modalAddressAlert = $("#modalAddressAlert");
    const presetChips = $$(".preset-chip");

    function openAddressModal() {
        if (!addressModal) return;
        const currentAddr = address ? address.textContent.trim() : "";
        if (modalAddressInput) {
            modalAddressInput.value = (currentAddr && currentAddr !== "Address not provided") ? currentAddr : defaultInitialAddress;
        }
        if (modalAddressAlert) modalAddressAlert.style.display = "none";
        addressModal.classList.add("active");
        addressModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        setTimeout(() => modalAddressInput && modalAddressInput.focus(), 150);
    }

    function closeAddressModalFunc() {
        if (!addressModal) return;
        addressModal.classList.remove("active");
        addressModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (changeBtn) {
        changeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openAddressModal();
        });
    }

    if (closeAddressModal) closeAddressModal.addEventListener("click", closeAddressModalFunc);
    if (cancelAddressBtn) cancelAddressBtn.addEventListener("click", closeAddressModalFunc);
    if (addressModal) {
        addressModal.addEventListener("click", (e) => {
            if (e.target === addressModal) closeAddressModalFunc();
        });
    }

    presetChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const preset = chip.getAttribute("data-addr");
            if (preset && modalAddressInput) {
                modalAddressInput.value = preset;
                modalAddressInput.focus();
            }
        });
    });

    if (saveAddressBtn) {
        saveAddressBtn.addEventListener("click", async () => {
            const newAddress = modalAddressInput ? modalAddressInput.value.trim() : "";
            if (!newAddress) {
                if (modalAddressAlert) {
                    modalAddressAlert.textContent = "Please enter a valid delivery address.";
                    modalAddressAlert.style.display = "block";
                }
                return;
            }

            saveAddressBtn.disabled = true;
            saveAddressBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            if (address) address.textContent = newAddress;

            // 1. Update in local storage
            try {
                let orderData = JSON.parse(localStorage.getItem("last-order")) || {};
                if (!orderData.deliveryInfo) orderData.deliveryInfo = {};
                orderData.deliveryInfo.address = newAddress;
                orderData.address = newAddress;
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
                        body: JSON.stringify({ "deliveryInfo.address": newAddress, address: newAddress })
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
                        body: JSON.stringify({ address: newAddress })
                    }).catch(() => {});
                }
            } catch (err) {
                console.error("Profile address update error:", err);
            }

            saveAddressBtn.disabled = false;
            saveAddressBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';

            setTimeout(() => {
                saveAddressBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Save Address</span>';
                closeAddressModalFunc();
            }, 600);

            // Visual feedback on the trigger button
            if (changeBtn) {
                const orig = changeBtn.innerHTML;
                changeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Updated';
                changeBtn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
                setTimeout(() => {
                    changeBtn.innerHTML = orig;
                    changeBtn.style.background = "";
                }, 2500);
            }
        });
    }

    /* =========================================================
       SUPPORT CENTER MODAL (24/7 HELPLINE) HANDLER
    ========================================================= */
    const supportModal = $("#supportModal");
    const needSupportBtn = $("#needSupportBtn") || $(".support-btn");
    const closeSupportModal = $("#closeSupportModal");
    const closeSupportBtn = $("#closeSupportBtn");
    const copyPhoneBtn = $("#copyPhoneBtn");
    const copyPhoneText = $("#copyPhoneText");
    const supportOrderNum = $("#supportOrderNum");
    const whatsappChannel = $("#whatsappChannel");
    const emailChannel = $("#emailChannel");

    const currentOrderIdText = (orderId && orderId.textContent.trim()) || "#RKR48291";
    if (supportOrderNum) supportOrderNum.textContent = currentOrderIdText;

    if (whatsappChannel) {
        const waMsg = encodeURIComponent(`Hi RKR Support, I need assistance regarding my order ${currentOrderIdText}.`);
        whatsappChannel.href = `https://wa.me/919876543210?text=${waMsg}`;
    }

    if (emailChannel) {
        const mailSub = encodeURIComponent(`Support Assistance for Order ${currentOrderIdText}`);
        const mailBody = encodeURIComponent(`Hello RKR Support Team,\n\nI need assistance with my live order ${currentOrderIdText}.\n\nThank you.`);
        emailChannel.href = `mailto:support@rkrrestaurant.com?subject=${mailSub}&body=${mailBody}`;
    }

    function openSupportModal() {
        if (!supportModal) return;
        supportModal.classList.add("active");
        supportModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeSupportModalFunc() {
        if (!supportModal) return;
        supportModal.classList.remove("active");
        supportModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (needSupportBtn) {
        needSupportBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSupportModal();
        });
    }

    if (closeSupportModal) closeSupportModal.addEventListener("click", closeSupportModalFunc);
    if (closeSupportBtn) closeSupportBtn.addEventListener("click", closeSupportModalFunc);
    if (supportModal) {
        supportModal.addEventListener("click", (e) => {
            if (e.target === supportModal) closeSupportModalFunc();
        });
    }

    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener("click", async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText("+919876543210");
                } else {
                    const tempInput = document.createElement("input");
                    tempInput.value = "+919876543210";
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
                }
                if (copyPhoneText) copyPhoneText.textContent = "Copied!";
                copyPhoneBtn.classList.add("copied");
                setTimeout(() => {
                    if (copyPhoneText) copyPhoneText.textContent = "Copy";
                    copyPhoneBtn.classList.remove("copied");
                }, 2000);
            } catch (err) {
                console.warn("Clipboard copy fallback:", err);
            }
        });
    }

    // Keyboard ESC listener for both modals
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAddressModalFunc();
            closeSupportModalFunc();
        }
    });

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
            text: "Order Confirmed & Placed",
            progress: 0,
            activeStep: 0
        },
        {
            text: "Preparing Your Meal in Kitchen",
            progress: 33.33,
            activeStep: 1
        },
        {
            text: "Valet Assigned • On The Way",
            progress: 66.66,
            activeStep: 2
        },
        {
            text: "Order Delivered Safely • Enjoy!",
            progress: 100,
            activeStep: 3
        }
    ];

    function applyTrackerStep(idx) {
        if (idx < 0 || idx >= updates.length) return;
        const u = updates[idx];

        if (liveText) {
            liveText.textContent = u.text;
        }

        if (trackerProgress) {
            trackerProgress.style.width = `${u.progress}%`;
        }

        trackerSteps.forEach((s, i) => {
            if (i <= u.activeStep) {
                s.classList.add("active");
            } else {
                s.classList.remove("active");
            }
        });
    }

    // Step 0 active on load
    applyTrackerStep(0);

    // Natural progression across cooking, dispatch, and delivery
    setTimeout(() => applyTrackerStep(1), 2500);
    setTimeout(() => applyTrackerStep(2), 6500);
    setTimeout(() => applyTrackerStep(3), 10500);

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
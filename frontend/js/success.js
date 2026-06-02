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
            lastOrder?.id || generateOrderId();
    }

    /* ==========================
       ADDRESS
    ========================== */

    const address =
        $("#success-address");

    if (
        address &&
        lastOrder?.address
    ) {
        address.textContent =
            lastOrder.address;
    }

    /* ==========================
       ORDER ITEMS
    ========================== */

    const IMAGE_MAPPING = {
      'Classic Smash Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
      'BBQ Bacon Burger': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=400',
      'Spicy Jalapeño Burger': 'https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=400',
      'Mushroom Swiss Burger': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400',
      'Veggie Avocado Burger': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=400',
      'Double Trouble Burger': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400',
      'Crispy Chicken Burger': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=400',
      'Truffle Royale Burger': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=400',
      'Korean BBQ Burger': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400',
      'Egg & Cheese Breakfast Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400',
      'Margherita Classic': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400',
      'Pepperoni Feast': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400',
      'BBQ Chicken Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400',
      'Four Cheese Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
      'Spicy Paneer Pizza': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400',
      'Veggie Supreme Pizza': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=400',
      'Peri Peri Chicken Pizza': 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=400',
      'Truffle Mushroom Pizza': 'https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=400',
      'Prawn & Garlic Pizza': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400',
      'Nutella Dessert Pizza': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400',
      'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400',
      'Crispy Fried Chicken': 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400',
      'Chicken Shawarma Wrap': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=400',
      'Grilled Lemon Herb Chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?q=80&w=400',
      'Chicken Tikka': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400',
      'Nashville Hot Chicken': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=400',
      'Chicken Caesar Salad': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400',
      'Dragon Fire Wings': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400',
      'Chicken Quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=400',
      'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400',
      'Mango Lassi': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=400',
      'Classic Cold Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400',
      'Fresh Lime Soda': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400',
      'Strawberry Milkshake': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
      'Watermelon Cooler': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=400',
      'Chocolate Brownie Shake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400',
      'Virgin Mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400',
      'Rose Sharbat': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400',
      'Masala Chai': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400',
      'Blue Lagoon Mocktail': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400',
      'Cheese Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
      'Italian Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000'
    };

    const container =
        $("#success-items-container");

    if (
        container &&
        lastOrder?.items?.length
    ) {

        const totalQty =
            lastOrder.items.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );

        container.innerHTML = `
            <div class="items-header">
                <h3>Order Summary</h3>
                <span>${totalQty} Items</span>
            </div>

            ${lastOrder.items.map(item => {
                const matchedImg = item.image || item.img || IMAGE_MAPPING[item.name] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400';
                return `
                <div class="food-item">

                    <div class="food-left">

                        <div class="food-image">

                            <img
                                src="${matchedImg}"
                                alt="${item.name}"
                                onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400'"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                    border-radius:16px;
                                "
                            >

                        </div>

                        <div>
                            <h4>${item.name}</h4>

                            <p>
                                ${item.quantity} × ₹${item.price}
                            </p>
                        </div>

                    </div>

                    <strong>
                        ₹${item.price * item.quantity}
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
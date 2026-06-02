async function sendResetLink() {

    const email = document.getElementById("resetEmail").value.trim();
    const mobile = document.getElementById("resetMobile").value.trim();

    const resetBtn = document.querySelector(".reset-btn");

    // VALIDATION

    if(email === "" && mobile === ""){

        showMessage("Please enter Email or Mobile Number", "error");
        return;
    }

    // EMAIL VALIDATION

    if(email !== ""){

        const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailPattern.test(email)){

            showMessage("Please enter valid email", "error");
            return;
        }
    }

    // MOBILE VALIDATION

    if(mobile !== ""){

        const mobilePattern =
        /^[0-9]{10}$/;

        if(!mobilePattern.test(mobile)){

            showMessage("Please enter valid 10 digit mobile number", "error");
            return;
        }
    }

    try{

        // BUTTON LOADING

        resetBtn.innerHTML = "Sending...";
        resetBtn.disabled = true;

        await new Promise(resolve =>
            setTimeout(resolve, 2000)
        );

        // SUCCESS MESSAGE

        if(email !== ""){

            showMessage("Password reset link sent to: " + email, "success");
        }

        if(mobile !== ""){

            // DEMO OTP

            const demoOtp = Math.floor(
                100000 + Math.random() * 900000
            );

            localStorage.setItem(
                "demoOTP",
                demoOtp
            );

            showMessage("Demo OTP generated: " + demoOtp + " (saved to storage)", "success");
        }

        // REDIRECT TO LOGIN AFTER 2s
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    }catch(error){

        console.log(error);

        showMessage("Server Error ❌", "error");

    }finally{

        resetBtn.innerHTML = "Send Reset Link";
        resetBtn.disabled = false;
    }
}

/* =========================================
   CUSTOM GLASSMORPHIC MESSAGE SYSTEM
========================================= */

function showMessage(message, type) {
    const oldMessage = document.querySelector(".message-box");
    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox = document.createElement("div");
    messageBox.className = `message-box ${type}`;
    
    // Add icon based on type
    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === 'success') {
        icon = '<i class="fa-solid fa-circle-check"></i>';
    } else if (type === 'error') {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    }
    
    messageBox.innerHTML = `${icon} <span>${message}</span>`;
    
    messageBox.style.display = "flex";
    messageBox.style.alignItems = "center";
    messageBox.style.justifyContent = "center";
    messageBox.style.gap = "10px";
    messageBox.style.padding = "12px 18px";
    messageBox.style.marginBottom = "18px";
    messageBox.style.borderRadius = "12px";
    messageBox.style.fontSize = "13px";
    messageBox.style.fontWeight = "500";
    messageBox.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    messageBox.style.animation = "slideInDown 0.4s forwards";
    
    if (type === "success") {
        messageBox.style.background = "rgba(46, 125, 50, 0.15)";
        messageBox.style.border = "1px solid rgba(46, 125, 50, 0.3)";
        messageBox.style.color = "#4caf50";
    } else {
        messageBox.style.background = "rgba(244, 67, 54, 0.15)";
        messageBox.style.border = "1px solid rgba(244, 67, 54, 0.3)";
        messageBox.style.color = "#f44336";
    }
    
    if (!document.getElementById("messageBoxAnimation")) {
        const style = document.createElement("style");
        style.id = "messageBoxAnimation";
        style.innerHTML = `
            @keyframes slideInDown {
                from { opacity: 0; transform: translateY(-15px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const form = document.getElementById("forgotForm");
    if (form) {
        form.prepend(messageBox);
    }
    
    setTimeout(() => {
        messageBox.style.opacity = "0";
        messageBox.style.transform = "translateY(-10px)";
        setTimeout(() => {
            messageBox.remove();
        }, 400);
    }, 3000);
}
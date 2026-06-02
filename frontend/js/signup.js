/* =========================================
   RKR RESTAURANT - SIGNUP JS
========================================= */

/* SIGNUP FUNCTION */

async function signupUser(){

    // INPUT VALUES

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    const terms =
    document.getElementById("terms").checked;

    const signupBtn =
    document.querySelector(".signup-btn");


    /* VALIDATION */

    if(!name || !email || !password || !confirmPassword){

        showMessage("Please fill all fields", "error");
        return;
    }

    // EMAIL VALIDATION

    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        showMessage("Enter a valid email address", "error");
        return;
    }

    // PASSWORD MATCH

    if(password !== confirmPassword){

        showMessage("Passwords do not match", "error");
        return;
    }

    // PASSWORD LENGTH

    if(password.length < 6){

        showMessage("Password must be at least 6 characters", "error");
        return;
    }

    // TERMS CHECK

    if(!terms){

        showMessage("Please accept Terms & Conditions", "error");
        return;
    }

    try{

        // BUTTON LOADING

        signupBtn.innerHTML = "Creating Account...";

        signupBtn.disabled = true;


        // API REQUEST

        const response = await fetch(
            "http://localhost:5000/api/auth/signup",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name,
                    email,
                    password

                })

            }
        );

        const data = await response.json();

        // SUCCESS

        if(response.ok){

            showMessage("Signup Successful ✅", "success");

            // SAVE USER

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            // REDIRECT TO LOGIN AFTER 1.5s
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        }else{

            showMessage(
                data.message || "Signup Failed ❌",
                "error"
            );
        }

    }catch(error){

        console.log(error);

        showMessage("Server Error ❌", "error");

    }finally{

        // RESET BUTTON

        signupBtn.innerHTML = "Create Account";

        signupBtn.disabled = false;
    }
}


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

function togglePassword(inputId, icon){

    const input =
    document.getElementById(inputId);

    if(input.type === "password"){

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }else{

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");
    }
}


/* =========================================
   SOCIAL LOGIN BUTTONS
========================================= */

function googleLogin(){

    window.open(
        "https://accounts.google.com/",
        "_blank"
    );
}

function facebookLogin(){

    window.open(
        "https://www.facebook.com/login/",
        "_blank"
    );
}

function appleLogin(){

    window.open(
        "https://appleid.apple.com/",
        "_blank"
    );
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
    
    const form = document.getElementById("signupForm");
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
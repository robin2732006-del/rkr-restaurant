async function loginUser(){

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    const loginBtn =
    document.querySelector(".login-btn");

    // VALIDATION

    if(email === "" || password === ""){

        showMessage(
            "Please fill all fields",
            "error"
        );

        return;
    }

    // EMAIL CHECK

    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        showMessage(
            "Enter valid email address",
            "error"
        );

        return;
    }

    try{

        loginBtn.innerHTML =
        "Logging in...";

        loginBtn.disabled = true;

        // API CALL

        const response =
        await fetch(
        "https://rkr-restaurant-backend.onrender.com/api/auth/login",

        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })
        });

        const data =
        await response.json();

        if(response.ok){

            // SAVE USER

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            showMessage(
                "Login Successful ✅",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                "index.html";

            },1500);

        }else{

            showMessage(
                data.message ||
                "Invalid email or password",
                "error"
            );
        }

    }catch(error){

        console.log(error);

        showMessage(
            "Server Error ❌",
            "error"
        );
    }

    finally{

        loginBtn.innerHTML =
        "Login Account";

        loginBtn.disabled = false;
    }
}

/* SHOW PASSWORD */

function togglePassword(){

    const passwordInput =
    document.getElementById("password");

    const icon =
    document.querySelector(".toggle-password");

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

        icon.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    }else{

        passwordInput.type = "password";

        icon.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );
    }
}

/* SOCIAL LOGIN */

function googleLogin(){

    window.open(
    "https://accounts.google.com/",
    "_blank"
    );
}

function facebookLogin(){

    window.open(
    "https://facebook.com/login/",
    "_blank"
    );
}

function appleLogin(){

    window.open(
    "https://appleid.apple.com/",
    "_blank"
    );
}

/* CUSTOM GLASSMORPHIC MESSAGE SYSTEM */

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
    
    const form = document.getElementById("loginForm");
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
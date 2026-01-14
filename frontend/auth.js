const API_URL = 'http://127.0.0.1:5000/v1/auth';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageBox = document.getElementById('message-box');
const title = document.getElementById('title');

// Toggle forms
document.getElementById('show-register').onclick = () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    title.innerText = 'Register';
    messageBox.style.display = 'none';
};

document.getElementById('show-login').onclick = () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    title.innerText = 'Login';
    messageBox.style.display = 'none';
};

function showMessage(msg, type) {
    messageBox.innerText = msg;
    messageBox.className = `message ${type}`;
    messageBox.style.display = 'block';
}

// Handle Registration
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage("Registration successful! Please login.", "success");
            registerForm.reset();
        } else {
            showMessage(data.message, "error");
        }
    } catch (err) {
        showMessage("Server connection failed", "error");
    }
};

// Handle Login
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Save token and info
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html';
        } else {
            showMessage(data.message, "error");
        }
    } catch (err) {
        showMessage("Server connection failed", "error");
    }
};

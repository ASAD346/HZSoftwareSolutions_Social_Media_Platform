const API_URL = 'http://localhost:3000/api';

const App = {
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null // Assuming we might use JWT later, but for now simple session/cookie or just user object persistence
    },

    init: () => {
        App.updateAuthUI();
        App.handleLogout();
    },

    updateAuthUI: () => {
        if (App.state.user) {
            document.body.classList.add('authenticated');
            document.body.classList.remove('unauthenticated');
        } else {
            document.body.classList.remove('authenticated');
            document.body.classList.add('unauthenticated');
        }
    },

    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                App.state.user = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/feed.html'; // Basic redirect
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    },

    signup: async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();

            if (response.ok) {
                alert('Account created! Please login.');
                window.location.href = '/index.html';
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Signup failed');
        }
    },

    logout: () => {
        App.state.user = null;
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    },

    handleLogout: () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                App.logout();
            });
        }
    }
};

// Utils
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Auto init if not waiting for DOM
// document.addEventListener('DOMContentLoaded', App.init);

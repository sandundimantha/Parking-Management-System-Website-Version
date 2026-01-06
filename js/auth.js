const Auth = {
    // Keys for LocalStorage
    USERS_KEY: 'parkPalUsers',
    CURRENT_USER_KEY: 'parkPalCurrentUser',

    // Register a new user
    register: function (name, email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, message: 'Registration successful! Please login.' };
    },

    // Login user
    login: function (email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save sanitized user to session (no password)
            const { password, ...safeUser } = user;
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(safeUser));
            return { success: true, user: safeUser };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    // Logout
    logout: function () {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    },

    // Get current logged in user
    getCurrentUser: function () {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    },

    // Protect a route (redirect if not logged in)
    requireLogin: function () {
        if (!this.getCurrentUser()) {
            window.location.href = 'login.html';
        }
    }
};

// UI Helpers
document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Logout Button
    // We check for both IDs used in different contexts
    const logoutBtn = document.getElementById('logout-btn') || document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    // 2. Update Nav based on Auth state
    const user = Auth.getCurrentUser();
    const navLinks = document.querySelector('.nav-links');

    if (user && navLinks) {
        // Find the Login link to replace with Dashboard
        const loginLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.href.includes('login.html'));

        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = 'dashboard.html';
        }
    }
});

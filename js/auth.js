const Auth = {
    // Keys for LocalStorage
    USERS_KEY: 'parkPalUsers',
    CURRENT_USER_KEY: 'parkPalCurrentUser',

    // Admin Credentials (Hardcoded for demo)
    ADMIN_EMAIL: 'admin@smartpark.com',
    ADMIN_PASS: 'admin123',

    // Register a new user
    register: function (name, email, password, role = 'user') {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role // Store dynamic role
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, message: `Registration successful as ${role}! Please login.` };
    },

    // Login user
    login: function (email, password, requiredRole = 'user') {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];

        // 1. If Admin Login requested
        if (requiredRole === 'admin') {
            // Check hardcoded admin first
            if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASS) {
                const adminUser = {
                    id: 'admin-001',
                    name: 'System Admin',
                    email: this.ADMIN_EMAIL,
                    role: 'admin'
                };
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(adminUser));
                return { success: true, user: adminUser };
            }

            // Check registered admins
            const adminUser = users.find(u => u.email === email && u.password === password && u.role === 'admin');
            if (adminUser) {
                const { password, ...safeUser } = adminUser;
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(safeUser));
                return { success: true, user: safeUser };
            }

            return { success: false, message: 'Invalid Admin Credentials' };
        }

        // 2. If User Login requested
        if (requiredRole === 'user') {
            // Check registered users
            const user = users.find(u => u.email === email && u.password === password);

            // Ensure we don't accidentally log in an admin as a user (strict separation)
            // Or allow it? strict separation is better.
            if (user && user.role === 'admin') {
                return { success: false, message: 'This is an Admin account. Please use Admin Login.' };
            }

            if (user && user.role === 'user') {
                const { password, ...safeUser } = user;
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(safeUser));
                return { success: true, user: safeUser };
            }
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
    },

    // Protect Admin Route
    requireAdmin: function () {
        const user = this.getCurrentUser();
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html';
            return false;
        }
        return true;
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
            if (user.role === 'admin') {
                loginLink.textContent = 'Admin Panel';
                loginLink.href = 'admin.html';
                loginLink.classList.add('active'); // Highlight if on admin page?
                // Optional: remove other irrelevant links for admin?
            } else {
                loginLink.textContent = 'Dashboard';
                loginLink.href = 'dashboard.html';
            }
        }
    }
});

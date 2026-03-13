/**
 * Authentication and User Management System
 * Simulates a backend auth system using localStorage
 */

const AUTH_KEY = 'semanti_users';
const CURRENT_USER_KEY = 'semanti_current_user';

// Initialize mock DB if it doesn't exist
if (!localStorage.getItem(AUTH_KEY)) {
    localStorage.setItem(AUTH_KEY, JSON.stringify([]));
}

const auth = {
    /**
     * Get all users
     * @returns {Array} List of all users
     */
    getAllUsers: function() {
        return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    },

    /**
     * Get a specific user by email
     * @param {string} email 
     * @returns {Object|null} User object or null
     */
    getUser: function(email) {
        const users = this.getAllUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    /**
     * Register a new user
     * @param {Object} userData 
     * @returns {Object} Result object with success status and user data
     */
    saveUser: function(userData) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        if (this.getUser(userData.email)) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Generate unique ID and structured layout per spec
        const newUser = {
            id: 'u_' + Math.random().toString(36).substr(2, 9),
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password, // hashed in a real system
            joinDate: new Date().toISOString().split('T')[0],
            plan: 'free',
            scansRemaining: 5,
            scanHistory: [],
            documents: []
        };

        users.push(newUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(users));
        
        // Auto-login after signup
        this.setCurrentUser(newUser);

        // --- Seed Initial Documents for Demo Purposes ---
        if (window.db && window.db.createDocument) {
            const doc1 = window.db.createDocument(newUser.id, "Research_Methodology_Draft.pdf");
            const doc2 = window.db.createDocument(newUser.id, "History_101_Midterm.docx");
            
            // Give them some fake scan results right away
            window.db.addScanResult(doc1.id, 12);
            window.db.addScanResult(doc2.id, 85);
        }

        return { success: true, user: newUser };
    },

    /**
     * Validate login credentials
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} Result object with success status and user data
     */
    validateLogin: function(email, password) {
        const user = this.getUser(email);
        
        if (!user || user.password !== password) {
            return { success: false, message: 'Invalid email or password' };
        }

        this.setCurrentUser(user);
        return { success: true, user: user };
    },

    /**
     * Update existing user data (for scans remaining, history etc)
     * @param {string} userId 
     * @param {Object} updates 
     * @returns {window.auth} For chaining
     */
    updateUserData: function(userId, updates) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index === -1) return this;

        users[index] = { ...users[index], ...updates };
        localStorage.setItem(AUTH_KEY, JSON.stringify(users));
        
        // Update current user session if it's the one being modified
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            this.setCurrentUser(users[index]);
        }
        
        return this;
    },

    /**
     * Set the currently logged in user
     * @param {Object} user 
     */
    setCurrentUser: function(user) {
        // We avoid storing password in active session 
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    },

    /**
     * Get the currently logged in user
     * @returns {Object|null}
     */
    getCurrentUser: function() {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Log out current user
     */
    logout: function() {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isAuthenticated: function() {
        return !!this.getCurrentUser();
    }
};

window.auth = auth;

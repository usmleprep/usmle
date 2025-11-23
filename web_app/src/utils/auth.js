/**
 * Authentication utilities for managing user sessions
 */

const SESSION_KEY = 'usmle_session';

/**
 * Save authenticated session to localStorage
 * @param {string} email - User's email
 */
export function saveSession(email) {
    const session = {
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Get current session from localStorage
 * @returns {{email: string, timestamp: string, expiresAt: string} | null}
 */
export function getSession() {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);

        // Check if session has expired
        const expirationDate = new Date(session.expiresAt);
        if (expirationDate < new Date()) {
            logout();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Failed to get session:', error);
        return null;
    }
}

/**
 * Check if user is currently authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return getSession() !== null;
}

/**
 * Get authenticated user's email
 * @returns {string | null}
 */
export function getUserEmail() {
    const session = getSession();
    return session ? session.email : null;
}

/**
 * Clear session and log out user
 */
export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

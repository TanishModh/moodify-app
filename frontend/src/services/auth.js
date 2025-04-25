// Use MongoDB-only backend base URL
const API_URL = 'http://localhost:5000';

// Register a new user and store relevant user info in localStorage
export const register = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message);
        // Save username in localStorage
        localStorage.setItem('username', username);
        return data;
    } catch (error) {
        throw error;
    }
};

// Login a user and store relevant user info in localStorage
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        // Save username in localStorage
        localStorage.setItem('username', data.username);
        return data;
    } catch (error) {
        throw error;
    }
};

// Logout the user and clear all relevant info
export const logout = () => {
    localStorage.removeItem('username');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('username');
};

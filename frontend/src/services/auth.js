// Use MySQL backend base URL (PHP API)
const API_URL = 'http://localhost/moodify/backend/api';

// Register a new user and store relevant user info in localStorage
export const register = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/users/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message);
        return data;
    } catch (error) {
        throw error;
    }
};

// Login a user and store relevant user info in localStorage
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/users/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        // Save user info in localStorage
        if (data.message === 'Login successful') {
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('isLoggedIn', 'true');
        }
        return data;
    } catch (error) {
        throw error;
    }
};

// Logout the user and clear all relevant info
export const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn');
};

export const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

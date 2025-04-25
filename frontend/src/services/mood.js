// MongoDB-only backend base URL
const API_URL = 'http://localhost:5000';

export const saveMood = async (mood) => {
    try {
        const username = localStorage.getItem('username');

        console.log('saveMood - User data:', { username, mood });

        if (!username) {
            console.error('saveMood - Missing username');
            throw new Error('User not authenticated');
        }

        console.log('saveMood - Making API request to:', `${API_URL}/mood`);
        
        const response = await fetch(`${API_URL}/mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, mood }),
        });
        
        const data = await response.json();
        console.log('saveMood - API response:', data);
        
        if (!response.ok) {
            console.error('saveMood - API error:', data);
            throw new Error(data.message || 'Failed to save mood');
        }
        
        return data;
    } catch (error) {
        console.error('Error saving mood:', error);
        throw error;
    }
};

export const getUserMoods = async () => {
    try {
        const username = localStorage.getItem('username');
        const response = await fetch(`${API_URL}/mood/${username}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch moods');
        }
        return data;
    } catch (error) {
        console.error('Error fetching moods:', error);
        throw error;
    }
};

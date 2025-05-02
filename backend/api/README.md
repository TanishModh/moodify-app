# Moodify MySQL Database Setup and API Guide

This guide explains how to set up the MySQL database for Moodify and how to use the PHP API endpoints for user authentication and mood tracking.

## Database Setup

### Prerequisites
- XAMPP, WAMP, or MAMP installed (for local development)
- PHPMyAdmin access

### Steps to Create the Database

1. **Start your local server environment**:
   - Start Apache and MySQL services in XAMPP/WAMP/MAMP

2. **Access PHPMyAdmin**:
   - Open your browser and navigate to: http://localhost/phpmyadmin/

3. **Create the database**:
   - Click "New" in the left sidebar
   - Enter "moodify_db" as the database name
   - Select "utf8mb4_general_ci" as the collation
   - Click "Create"

4. **Create the tables**:
   - Select the "moodify_db" database
   - Click on the "SQL" tab
   - Execute the following SQL:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### User Registration
- **URL**: `/api/users/register.php`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "email": "your_email@example.com",
    "password": "your_password"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### User Login
- **URL**: `/api/users/login.php`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Login successful",
    "username": "your_username",
    "user_id": 1
  }
  ```

### Save Mood
- **URL**: `/api/moods/save_mood.php`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "mood": "happy"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Mood saved successfully"
  }
  ```

### Get User Moods
- **URL**: `/api/moods/get_moods.php?username=your_username`
- **Method**: GET
- **Response**: 
  ```json
  [
    {
      "mood": "happy",
      "created_at": "2025-05-01 20:45:30"
    },
    {
      "mood": "sad",
      "created_at": "2025-05-01 15:30:22"
    }
  ]
  ```

## Connecting to the Frontend

Update your frontend API calls to use these new endpoints. For example:

```javascript
// Registration
fetch('http://localhost/moodify/backend/api/users/register.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: username,
    email: email,
    password: password
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Login
fetch('http://localhost/moodify/backend/api/users/login.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: username,
    password: password
  })
})
.then(response => response.json())
.then(data => {
  if (data.message === 'Login successful') {
    // Store username in localStorage or state management
    localStorage.setItem('username', data.username);
  }
});

// Save mood
fetch('http://localhost/moodify/backend/api/moods/save_mood.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: localStorage.getItem('username'),
    mood: selectedMood
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Get moods
fetch(`http://localhost/moodify/backend/api/moods/get_moods.php?username=${localStorage.getItem('username')}`)
.then(response => response.json())
.then(data => {
  // Process the moods data
  console.log(data);
});
```

## Configuration

The database connection is configured in `api/config/database.php`. Update the following parameters if needed:

```php
$host = 'localhost';
$db_name = 'moodify_db';
$username = 'root';  // Default XAMPP username
$password = '';      // Default XAMPP password (empty)
```

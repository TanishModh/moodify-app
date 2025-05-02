<?php
// Simple script to check database connection and tables
header('Content-Type: text/html');

echo "<h1>Database Connection Test</h1>";

// Database connection parameters
$host = 'localhost';
$db_name = 'moodify_db';
$username = 'root';
$password = '';

try {
    // Try to connect to MySQL server (without specifying database)
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color:green'>✓ Connected to MySQL server successfully!</p>";
    
    // Check if database exists
    $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$db_name'");
    $dbExists = $stmt->fetchColumn();
    
    if ($dbExists) {
        echo "<p style='color:green'>✓ Database '$db_name' exists!</p>";
        
        // Connect to the specific database
        $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Check if tables exist
        $tables = ['users', 'moods'];
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                echo "<p style='color:green'>✓ Table '$table' exists!</p>";
                
                // Show table structure
                $stmt = $pdo->query("DESCRIBE $table");
                $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo "<p>Table structure:</p>";
                echo "<pre>";
                print_r($columns);
                echo "</pre>";
            } else {
                echo "<p style='color:red'>✗ Table '$table' does not exist!</p>";
                echo "<p>You need to create this table. SQL command:</p>";
                
                if ($table == 'users') {
                    echo "<pre>
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
                    </pre>";
                } else if ($table == 'moods') {
                    echo "<pre>
CREATE TABLE moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
                    </pre>";
                }
            }
        }
    } else {
        echo "<p style='color:red'>✗ Database '$db_name' does not exist!</p>";
        echo "<p>You need to create the database. SQL command:</p>";
        echo "<pre>CREATE DATABASE $db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;</pre>";
    }
} catch (PDOException $e) {
    echo "<p style='color:red'>✗ Connection failed: " . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), "Access denied for user") !== false) {
        echo "<p>Check your MySQL username and password. The default XAMPP credentials are:</p>";
        echo "<ul>";
        echo "<li>Username: root</li>";
        echo "<li>Password: (empty)</li>";
        echo "</ul>";
    } else if (strpos($e->getMessage(), "Could not find driver") !== false) {
        echo "<p>The PHP MySQL extension is not enabled. Make sure you have PHP MySQL extension enabled in your php.ini file.</p>";
    }
}
?>

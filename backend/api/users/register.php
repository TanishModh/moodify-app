<?php
// Headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just exit with 200 OK status
    http_response_code(200);
    exit;
}

// Include database connection
require_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Response array
$response = array();

// Check if required data is present
if(!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    
    // Sanitize input
    $username = htmlspecialchars(strip_tags($data->username));
    $email = htmlspecialchars(strip_tags($data->email));
    $password = $data->password; // Will be hashed, no need to strip tags
    
    // Check if username already exists
    $check_query = "SELECT id FROM users WHERE username = :username OR email = :email";
    $check_stmt = $pdo->prepare($check_query);
    $check_stmt->bindParam(':username', $username);
    $check_stmt->bindParam(':email', $email);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        // User already exists
        $response['error'] = 'Username or email already exists';
        http_response_code(400);
    } else {
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // SQL query to insert new user
        $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
        
        // Prepare statement
        $stmt = $pdo->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        
        // Execute query
        if($stmt->execute()) {
            $response['message'] = 'User registered successfully';
            http_response_code(201);
        } else {
            $response['error'] = 'Registration failed';
            http_response_code(500);
        }
    }
} else {
    // Missing required data
    $response['error'] = 'Incomplete data - username, email, and password are required';
    http_response_code(400);
}

// Return response as JSON
echo json_encode($response);
?>

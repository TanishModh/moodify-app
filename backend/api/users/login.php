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
if(!empty($data->username) && !empty($data->password)) {
    
    // Sanitize input
    $username = htmlspecialchars(strip_tags($data->username));
    $password = $data->password;
    
    // SQL query to find user
    $query = "SELECT id, username, email, password FROM users WHERE username = :username";
    
    // Prepare statement
    $stmt = $pdo->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':username', $username);
    
    // Execute query
    $stmt->execute();
    
    // Check if user exists
    if($stmt->rowCount() > 0) {
        $user = $stmt->fetch();
        
        // Verify password
        if(password_verify($password, $user['password'])) {
            // Password is correct
            $response = array(
                'message' => 'Login successful',
                'username' => $user['username'],
                'user_id' => $user['id']
            );
            http_response_code(200);
        } else {
            // Password is incorrect
            $response['error'] = 'Invalid credentials';
            http_response_code(401);
        }
    } else {
        // User not found
        $response['error'] = 'Invalid credentials';
        http_response_code(401);
    }
} else {
    // Missing required data
    $response['error'] = 'Username and password are required';
    http_response_code(400);
}

// Return response as JSON
echo json_encode($response);
?>

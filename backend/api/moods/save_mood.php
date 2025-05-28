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
if(!empty($data->username) && !empty($data->mood)) {
    
    // Sanitize input
    $username = htmlspecialchars(strip_tags($data->username));
    $mood = htmlspecialchars(strip_tags($data->mood));
    
    // First get the user ID from username
    $user_query = "SELECT id FROM users WHERE username = :username";
    $user_stmt = $pdo->prepare($user_query);
    $user_stmt->bindParam(':username', $username);
    $user_stmt->execute();
    
    if($user_stmt->rowCount() > 0) {
        $user = $user_stmt->fetch();
        $user_id = $user['id'];
        
        // SQL query to insert mood
        $query = "INSERT INTO moods (user_id, mood) VALUES (:user_id, :mood)";
        
        // Prepare statement
        $stmt = $pdo->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':mood', $mood);
        
        // Execute query
        if($stmt->execute()) {
            $response['message'] = 'Mood saved successfully';
            http_response_code(201);
        } else {
            $response['error'] = 'Failed to save mood';
            http_response_code(500);
        }
    } else {
        // User not found
        $response['error'] = 'User not found';
        http_response_code(404);
    }
} else {
    // Missing required data
    $response['error'] = 'Username and mood are required';
    http_response_code(400);
}

// Return response as JSON
echo json_encode($response);
?>

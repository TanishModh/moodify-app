<?php
// Headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just exit with 200 OK status
    http_response_code(200);
    exit;
}

// Include database connection
require_once '../config/database.php';

// Get username from URL parameter
$username = isset($_GET['username']) ? $_GET['username'] : '';

// Response array
$response = array();

if(!empty($username)) {
    // Sanitize input
    $username = htmlspecialchars(strip_tags($username));
    
    // First get the user ID from username
    $user_query = "SELECT id FROM users WHERE username = :username";
    $user_stmt = $pdo->prepare($user_query);
    $user_stmt->bindParam(':username', $username);
    $user_stmt->execute();
    
    if($user_stmt->rowCount() > 0) {
        $user = $user_stmt->fetch();
        $user_id = $user['id'];
        
        // SQL query to get user's moods
        $query = "SELECT mood, created_at FROM moods WHERE user_id = :user_id ORDER BY created_at DESC";
        
        // Prepare statement
        $stmt = $pdo->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':user_id', $user_id);
        
        // Execute query
        $stmt->execute();
        
        // Check if any moods exist
        if($stmt->rowCount() > 0) {
            // Fetch all moods
            $moods = $stmt->fetchAll();
            
            // Return moods
            echo json_encode($moods);
            http_response_code(200);
        } else {
            // No moods found
            echo json_encode(array());
            http_response_code(200);
        }
    } else {
        // User not found
        $response['error'] = 'User not found';
        http_response_code(404);
        echo json_encode($response);
    }
} else {
    // Missing username
    $response['error'] = 'Username is required';
    http_response_code(400);
    echo json_encode($response);
}
?>

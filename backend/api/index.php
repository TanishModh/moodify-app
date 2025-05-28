<?php
// Headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');

// Response array
$response = array(
    'status' => 'success',
    'message' => 'Welcome to the Moodify API',
    'endpoints' => array(
        'register' => '/api/users/register.php',
        'login' => '/api/users/login.php',
        'save_mood' => '/api/moods/save_mood.php',
        'get_moods' => '/api/moods/get_moods.php?username={username}'
    )
);

// Return response as JSON
echo json_encode($response);
?>

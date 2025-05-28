<?php
// Test script for Moodify MySQL API endpoints
header('Content-Type: text/html');

// Configuration
$base_url = 'http://localhost/moodify/backend/api';
$test_username = 'testuser_' . time(); // Unique username
$test_email = 'test_' . time() . '@example.com'; // Unique email
$test_password = 'password123';
$test_mood = 'happy';

echo "<h1>Moodify MySQL API Test</h1>";
echo "<p>Testing API endpoints with test user: <strong>{$test_username}</strong></p>";

// Function to make API requests
function makeRequest($url, $method = 'GET', $data = null) {
    $curl = curl_init();
    
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method,
    ];
    
    if ($method === 'POST' && $data) {
        $options[CURLOPT_POSTFIELDS] = json_encode($data);
        $options[CURLOPT_HTTPHEADER] = [
            'Content-Type: application/json',
            'Content-Length: ' . strlen(json_encode($data))
        ];
    }
    
    curl_setopt_array($curl, $options);
    
    $response = curl_exec($curl);
    $status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    
    curl_close($curl);
    
    return [
        'status_code' => $status_code,
        'response' => $response ? json_decode($response, true) : null,
        'error' => $error
    ];
}

// Test 1: Check API index
echo "<h2>Test 1: Check API Index</h2>";
$result = makeRequest($base_url);
echo "<pre>" . print_r($result, true) . "</pre>";
echo "<hr>";

// Test 2: Register a new user
echo "<h2>Test 2: Register New User</h2>";
$register_data = [
    'username' => $test_username,
    'email' => $test_email,
    'password' => $test_password
];
$result = makeRequest("{$base_url}/users/register.php", 'POST', $register_data);
echo "<pre>" . print_r($result, true) . "</pre>";

if ($result['status_code'] === 201) {
    echo "<p style='color: green;'>✓ Registration successful!</p>";
} else {
    echo "<p style='color: red;'>✗ Registration failed!</p>";
    die("Tests stopped due to registration failure.");
}
echo "<hr>";

// Test 3: Login with the new user
echo "<h2>Test 3: Login User</h2>";
$login_data = [
    'username' => $test_username,
    'password' => $test_password
];
$result = makeRequest("{$base_url}/users/login.php", 'POST', $login_data);
echo "<pre>" . print_r($result, true) . "</pre>";

if ($result['status_code'] === 200) {
    echo "<p style='color: green;'>✓ Login successful!</p>";
} else {
    echo "<p style='color: red;'>✗ Login failed!</p>";
    die("Tests stopped due to login failure.");
}
echo "<hr>";

// Test 4: Save a mood
echo "<h2>Test 4: Save Mood</h2>";
$mood_data = [
    'username' => $test_username,
    'mood' => $test_mood
];
$result = makeRequest("{$base_url}/moods/save_mood.php", 'POST', $mood_data);
echo "<pre>" . print_r($result, true) . "</pre>";

if ($result['status_code'] === 201) {
    echo "<p style='color: green;'>✓ Mood saved successfully!</p>";
} else {
    echo "<p style='color: red;'>✗ Failed to save mood!</p>";
}
echo "<hr>";

// Test 5: Get moods
echo "<h2>Test 5: Get Moods</h2>";
$result = makeRequest("{$base_url}/moods/get_moods.php?username={$test_username}");
echo "<pre>" . print_r($result, true) . "</pre>";

if ($result['status_code'] === 200) {
    echo "<p style='color: green;'>✓ Retrieved moods successfully!</p>";
    
    if (is_array($result['response']) && count($result['response']) > 0) {
        echo "<p>Found " . count($result['response']) . " mood(s) for user {$test_username}</p>";
    } else {
        echo "<p style='color: orange;'>⚠ No moods found for user (this might be an issue)</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Failed to retrieve moods!</p>";
}
echo "<hr>";

echo "<h2>Test Summary</h2>";
echo "<p>All tests completed. Check the results above for any issues.</p>";
echo "<p>Test user created: <strong>{$test_username}</strong></p>";
?>

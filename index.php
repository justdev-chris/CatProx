<?php
// CatProx but in PHP
$target = "https://catsdevs.online"; // target site

// Get the requested path
$path = $_GET['path'] ?? '';
$url = rtrim($target, '/') . '/' . ltrim($path, '/');

// Initialize cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true); // include headers
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // follow redirects
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Forwarded-For: ',
    'X-Real-IP: ',
    'Via: '
]);

$response = curl_exec($ch);

// Separate headers and body
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

// Pass through headers
$header_lines = explode("\r\n", $headers);
foreach ($header_lines as $header_line) {
    if (stripos($header_line, 'Content-Length') === false && !empty($header_line)) {
        header($header_line);
    }
}

// Output body
echo $body;

curl_close($ch);
?>
